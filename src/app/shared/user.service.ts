import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {firstValueFrom, Observable} from "rxjs";
import {
  AuthFlowType,
  ChallengeNameType,
  ChangePasswordCommandOutput,
  CognitoIdentityProviderClient,
  ForgotPasswordCommand,
  ForgotPasswordResponse,
  InitiateAuthCommand,
  InitiateAuthCommandOutput,
  RespondToAuthChallengeCommand
} from "@aws-sdk/client-cognito-identity-provider";
import {environment} from 'src/environments/environment';
import {Router} from '@angular/router';
import {AppState} from "../app-state";
import {fromCognitoIdentityPool} from "@aws-sdk/credential-provider-cognito-identity";
import {CognitoIdentityClient} from "@aws-sdk/client-cognito-identity";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  cognito = new CognitoIdentityProviderClient({region: environment.region});
  cognitoIdentity = new CognitoIdentityClient({region: environment.region});

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  public async login(email: string, password: string): Promise<InitiateAuthCommandOutput> {
    const response = await this.cognito.send(new InitiateAuthCommand({
      AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
      ClientId: environment.cognitoAppClientId,
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password
      }
    }));

    AppState.set({
      refreshToken: response.AuthenticationResult?.RefreshToken,
      idToken: response.AuthenticationResult?.IdToken,
      accessToken: response.AuthenticationResult?.AccessToken,
      deviceKey: response.AuthenticationResult?.NewDeviceMetadata?.DeviceKey
    });

    if(response.ChallengeName) {
      this.router.navigate(['/auth', 'challenges', response.ChallengeName.toLowerCase()], {queryParams: {
        username: email,
        session: response.Session
      }});
    }else {
      await this.useRefreshToken(
        response.AuthenticationResult?.RefreshToken!
      );
      AppState.store();
    }

    return response;
  }

  getUserToken(code: string): Observable<any> {
    const body: HttpParams = new HttpParams()
      .set('client_id', environment.cognitoAppClientId)
      .set('code', code)
      .set('redirect_uri', location.origin + '/verify-fallback/')
      .set('grant_type', 'authorization_code');
    return this.http.post(environment.cognitoUrl + '/oauth2/token', body, {
      headers: new HttpHeaders().set(
        'Content-Type',
        'application/x-www-form-urlencoded'
      )
    });
  }

  public async loginWithIdpCode(code: string) {
    const response = await firstValueFrom(this.getUserToken(code));
    console.log(response);
  }

  public signup(email: string, captcha: string): Promise<any> {
    return firstValueFrom(this.http.post(environment.beUrl + '/user/signup', {
      email
    }, {
      headers: {
        'X-Google-Code': captcha
      }
    }))
  }

  public recoveryPassword(email: string): Promise<ForgotPasswordResponse> {
    return this.cognito.send(new ForgotPasswordCommand({
      ClientId: environment.cognitoAppClientId,
      Username: email
    }))
  }

  public async useRefreshToken(refreshToken: string): Promise<InitiateAuthCommandOutput> {
    const response = await this.cognito.send(new InitiateAuthCommand({
      AuthFlow: AuthFlowType.REFRESH_TOKEN_AUTH,
      ClientId: environment.cognitoAppClientId,
      AuthParameters: {
        REFRESH_TOKEN: refreshToken
      }
    }));
    const logins: {[key: string]: string} = {};
    logins[`cognito-idp.${environment.region}.amazonaws.com/${environment.cognitoUserPoolId}`] = AppState.val.idToken!;
    const credentials = await fromCognitoIdentityPool({
      accountId: environment.accountId,
      logins,
      client: this.cognitoIdentity as any,
      identityPoolId: environment.identityPoolId
    })();
    AppState.set({
      accessKeyId: credentials.accessKeyId,
      secretAccessKeyId: credentials.secretAccessKey,
      accessToken: response.AuthenticationResult?.AccessToken,
      idToken: response.AuthenticationResult?.IdToken,
      identityId: credentials.identityId
    })
    return response;
  }

  public async confirmNewPassword(username: string, newPassword: string, session: string): Promise<ChangePasswordCommandOutput> {
    return this.cognito.send(new RespondToAuthChallengeCommand({
      ChallengeName: ChallengeNameType.NEW_PASSWORD_REQUIRED,
      ClientId: environment.cognitoAppClientId,
      Session: session,
      ChallengeResponses: {
        NEW_PASSWORD: newPassword,
        USERNAME: username
      }
    }));
  }

  async checkIfAuthenticated(): Promise<boolean> {
    const refreshT = AppState.val.refreshToken;
    if(refreshT) {
      try {
        await this.useRefreshToken(refreshT);
        AppState.store();
        return true;
      } catch(e) {
        return false;
      }
    }
    return false;
  }

  logout() {
    localStorage.clear();
  }

}

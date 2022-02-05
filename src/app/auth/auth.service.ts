import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {firstValueFrom} from "rxjs";
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
import {UserDto} from "../shared/dto/user.dto";
import jwtDecode from "jwt-decode";
import {apiG} from "../shared/helpers";


export interface OAuthCredentials {
  access_token: string;
  expires_in: number;
  id_token: string;
  refresh_token: string;
  token_type: string;
}

export interface IAMCredentials {
  accessKeyId: string,
  secretAccessKey: string,
  sessionToken: string
}


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
      oauthCredentials: {
        refresh_token: response.AuthenticationResult?.RefreshToken,
        id_token: response.AuthenticationResult?.IdToken,
        expires_in: response.AuthenticationResult?.ExpiresIn,
        access_token: response.AuthenticationResult?.AccessToken
      }
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
    }
    const userPayload: UserDto = {
      email: email
    }

    await this.loginSignal(userPayload);

    return response;
  }

  getOAuthCredentials(code: string): Promise<OAuthCredentials> {
    const body: URLSearchParams = new URLSearchParams({
      client_id: environment.cognitoAppClientId,
      code,
      redirect_uri: location.origin + '/auth/verify-fallback',
      grant_type: 'authorization_code',
      token_endpoint: environment.cognitoUrl + '/oauth2/token',
      scope: 'openid email profile'
    })
    return firstValueFrom(this.http.post<OAuthCredentials>(environment.cognitoUrl + '/oauth2/token', body, {
      headers: new HttpHeaders().set(
        'Content-Type',
        'application/x-www-form-urlencoded; charset=UTF-8'
      )
    }));
  }

  public async loginSignal(userPayload: UserDto) {
    const message: 'USER_LOGGED' | 'USER_LOGGED_FIRST_TIME' = await (await apiG().fetch(
      environment.beUrl + '/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userPayload)
      })).text() as 'USER_LOGGED' | 'USER_LOGGED_FIRST_TIME';
    console.log(message);
  }

  public async loginWithIdpCode(code: string) {
    const response = await this.getOAuthCredentials(code);
    AppState.set({
      oauthCredentials: response
    });
    await this.useRefreshToken(response.refresh_token);

    const userPayload: UserDto = {
      email: (jwtDecode(response.id_token) as any).email
    };

    await this.loginSignal(userPayload);

    this.router.navigate(['/']);
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
    logins[`cognito-idp.${environment.region}.amazonaws.com/${environment.cognitoUserPoolId}`] = AppState.val.oauthCredentials.id_token!;
    const credentials = await fromCognitoIdentityPool({
      accountId: environment.accountId,
      logins,
      client: this.cognitoIdentity as any,
      identityPoolId: environment.identityPoolId
    })();
    AppState.set({
      iamCredentials: {
        accessKeyId: credentials.accessKeyId,
        secretAccessKey: credentials.secretAccessKey,
        sessionToken: credentials.sessionToken
      },
      identityId: credentials.identityId
    })
    AppState.store();
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
    const refreshT = AppState.val.oauthCredentials.refresh_token;
    if(refreshT) {
      try {
        await this.useRefreshToken(refreshT);
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

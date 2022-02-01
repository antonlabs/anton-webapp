import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {firstValueFrom, Observable} from "rxjs";
import {
  ChallengeNameType,
  ChangePasswordCommandOutput,
  CognitoIdentityProviderClient, ForgotPasswordCommand, ForgotPasswordResponse,
  InitiateAuthCommand,
  InitiateAuthCommandOutput,
  RespondToAuthChallengeCommand
} from "@aws-sdk/client-cognito-identity-provider";
import {environment} from 'src/environments/environment';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  cognito = new CognitoIdentityProviderClient({region: environment.region});

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  public async login(email: string, password: string): Promise<InitiateAuthCommandOutput> {
    const response = await this.cognito.send(new InitiateAuthCommand({
      AuthFlow: 'USER_PASSWORD_AUTH',
      ClientId: environment.cognitoAppClientId,
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password
      }
    }));
    console.log(response.AuthenticationResult);
    if(response.ChallengeName) {
      this.router.navigate(['/auth', 'challenges', response.ChallengeName.toLowerCase()], {queryParams: {
        username: email,
        session: response.Session
      }});
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

}

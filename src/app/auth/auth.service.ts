import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {firstValueFrom} from "rxjs";
import {
  ChallengeNameType,
  ChangePasswordCommandOutput,
  CognitoIdentityProviderClient,
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

  public signup(email: string, captcha: string): Promise<any> {
    return firstValueFrom(this.http.post(environment.beUrl + '/user/signup', {
      email
    }, {
      headers: {
        'X-Google-Code': captcha
      }
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

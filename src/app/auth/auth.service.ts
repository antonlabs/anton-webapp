import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {firstValueFrom} from "rxjs";
import {
  AuthFlowType,
  ChallengeNameType,
  ChangePasswordCommandOutput, ConfirmForgotPasswordCommand,
  ForgotPasswordCommand,
  ForgotPasswordResponse,
  InitiateAuthCommand,
  InitiateAuthCommandOutput,
  RespondToAuthChallengeCommand
} from "@aws-sdk/client-cognito-identity-provider";
import {environment} from 'src/environments/environment';
import {Router} from '@angular/router';
import {fromCognitoIdentityPool} from "@aws-sdk/credential-provider-cognito-identity";
import {UserDto} from "../shared/dto/user.dto";
import {apiG, cognito, cognitoIdentity, getUserListItem, jwtToUserDto} from "../shared/helpers";
import {UserService} from "../shared/user.service";
import {rack} from '../states/app-state';
import {currentLocation} from "../core/location";


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

  constructor(
    private http: HttpClient,
    private router: Router,
    private userService: UserService
  ) { }

  public async login(email: string, password: string): Promise<InitiateAuthCommandOutput> {
    const response = await cognito.send(new InitiateAuthCommand({
      AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
      ClientId: environment.cognitoAppClientId,
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password
      }
    }));

    rack.states.oAuthCredentials.set({
        refresh_token: response.AuthenticationResult?.RefreshToken,
        id_token: response.AuthenticationResult?.IdToken,
        expires_in: response.AuthenticationResult?.ExpiresIn,
        access_token: response.AuthenticationResult?.AccessToken
    });
    rack.states.user.set({
      email
    });

    rack.states.oAuthCredentials.store();

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
    const userPayload: UserDto = jwtToUserDto((response.AuthenticationResult?.IdToken) as any);

    await this.loginSignal(userPayload);

    this.router.navigateByUrl(await this.firstDestination());

    return response;
  }

  getOAuthCredentials(code: string): Promise<OAuthCredentials> {
    const body: URLSearchParams = new URLSearchParams({
      client_id: environment.cognitoAppClientId,
      code,
      redirect_uri: currentLocation() + '/auth/verify-fallback',
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

  public async loginSignal(userPayload: UserDto): Promise<'USER_LOGGED' | 'USER_LOGGED_FIRST_TIME'> {
    console.log('get user', rack.states.user);
    // const user = await getUserItem('USER');
    const user = undefined;
    const message: 'USER_LOGGED' | 'USER_LOGGED_FIRST_TIME' = user ? 'USER_LOGGED' : await (await apiG(
      'user/login', {
        method: 'POST',
        body: JSON.stringify(userPayload)
      })) as 'USER_LOGGED' | 'USER_LOGGED_FIRST_TIME';
    return message;
  }

  public async firstDestination(): Promise<string> {
    const wallets = await getUserListItem('WALLET');
    if(wallets?.length === 0) {
      return '/create-wallet'
    }
    return '/';
  }

  public async loginWithIdpCode(code: string) {
    const response = await this.getOAuthCredentials(code);
    rack.states.user.set(jwtToUserDto((response.id_token) as any));
    rack.states.oAuthCredentials.set(response);
    rack.states.oAuthCredentials.store();
    await this.useRefreshToken(response.refresh_token);

    const userPayload: UserDto = jwtToUserDto((response.id_token) as any);

    await this.loginSignal(userPayload);
    this.router.navigateByUrl(await this.firstDestination());
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
    return cognito.send(new ForgotPasswordCommand({
      ClientId: environment.cognitoAppClientId,
      Username: email
    }))
  }

  public async useRefreshToken(refreshToken: string): Promise<InitiateAuthCommandOutput> {
    const response = await cognito.send(new InitiateAuthCommand({
      AuthFlow: AuthFlowType.REFRESH_TOKEN_AUTH,
      ClientId: environment.cognitoAppClientId,
      AuthParameters: {
        REFRESH_TOKEN: refreshToken
      }
    }));
    const logins: {[key: string]: string} = {};
    logins[`cognito-idp.${environment.region}.amazonaws.com/${environment.cognitoUserPoolId}`] = rack.states.oAuthCredentials.val.id_token!;
    const credentials = await fromCognitoIdentityPool({
      accountId: environment.accountId,
      logins,
      client: cognitoIdentity as any,
      identityPoolId: environment.identityPoolId
    })();
    rack.states.iamCredentials.set({
        accessKeyId: credentials.accessKeyId,
        secretAccessKey: credentials.secretAccessKey,
        sessionToken: credentials.sessionToken
    });
    rack.states.user.set({
      identityId: credentials.identityId
    });
    rack.states.user.store();
    return response;
  }

  public async confirmNewPassword(username: string, newPassword: string, session: string): Promise<ChangePasswordCommandOutput> {
    return cognito.send(new RespondToAuthChallengeCommand({
      ChallengeName: ChallengeNameType.NEW_PASSWORD_REQUIRED,
      ClientId: environment.cognitoAppClientId,
      Session: session,
      ChallengeResponses: {
        NEW_PASSWORD: newPassword,
        USERNAME: username
      }
    }));
  }

  public async confirmForgotPassword(code: string, username: string, password: string): Promise<ChangePasswordCommandOutput> {
    return cognito.send(new ConfirmForgotPasswordCommand({
      ClientId: environment.cognitoAppClientId,
      ConfirmationCode: code,
      Password: password,
      Username: username
    }));
  }

  async checkIfAuthenticated(): Promise<boolean> {
    const refreshT = rack.states.oAuthCredentials.val.refresh_token;
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

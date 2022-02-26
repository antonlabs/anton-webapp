import {IAMCredentials} from "../auth/auth.service";
import {State} from "@antonlabs/rack";
import {rack} from "./app-state";
import {cognito, cognitoIdentity} from "../shared/helpers";
import {AuthFlowType, InitiateAuthCommand} from "@aws-sdk/client-cognito-identity-provider";
import {environment} from "../../environments/environment";
import {fromCognitoIdentityPool} from "@aws-sdk/credential-provider-cognito-identity";


type IamCredentialsProperties = IAMCredentials | undefined;

export class IamCredentialsState extends State<IamCredentialsProperties> {

  onCreate(): IamCredentialsProperties {
    return undefined;
  }

  async refreshState(): Promise<void> {
    const refreshToken = rack.states.oAuthCredentials.val.refresh_token;
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
    this.set({
      accessKeyId: credentials.accessKeyId,
      secretAccessKey: credentials.secretAccessKey,
      sessionToken: credentials.sessionToken
    });
    rack.states.user.set({
      identityId: credentials.identityId
    });
    rack.states.user.store();
  }

}

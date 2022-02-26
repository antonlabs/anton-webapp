import {OAuthCredentials} from "../auth/auth.service";
import {State} from "@antonlabs/rack";

interface CredentialsStateProps extends OAuthCredentials {}


export class CredentialsState extends State<CredentialsStateProps> {

  onCreate(): CredentialsStateProps {
    return {
      access_token: '',
      expires_in: 0,
      id_token: '',
      refresh_token: '',
      token_type: ''
    };
  }

  async refreshState(): Promise<void> {}

}

import {State} from "./state";
import {OAuthCredentials} from "../auth/auth.service";

interface CredentialsStateProps extends OAuthCredentials {}


export class CredentialsState extends State<CredentialsStateProps> {

  empty(): CredentialsStateProps {
    return {
      access_token: '',
      expires_in: 0,
      id_token: '',
      refresh_token: '',
      token_type: ''
    };
  }

}

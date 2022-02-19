import { State } from "./state";
import {IAMCredentials} from "../auth/auth.service";


type IamCredentialsProperties = IAMCredentials | undefined;

export class IamCredentialsState extends State<IamCredentialsProperties> {

  empty(): IamCredentialsProperties {
    return undefined;
  }

}

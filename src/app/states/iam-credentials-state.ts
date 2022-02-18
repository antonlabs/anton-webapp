import {BehaviorSubject} from "rxjs";
import { State } from "./state";
import {IAMCredentials} from "../auth/auth.service";

interface IamCredentialsProperties extends IAMCredentials {}

export class IamCredentialsState extends State<IamCredentialsProperties> {

  empty(): IamCredentialsProperties {
    return {
      accessKeyId: '',
      secretAccessKey: '',
      sessionToken: ''
    };
  }


}

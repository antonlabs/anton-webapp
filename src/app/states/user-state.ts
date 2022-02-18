import { UserDto } from "../shared/dto/user.dto";
import { State } from "./state";
import {BehaviorSubject} from "rxjs";

export interface UserStateProperties extends UserDto {}

export class UserState extends State<UserStateProperties> {

  empty(): UserStateProperties {
    return {
      identityId: undefined,
      email: '',
      avatar: '',
      name: undefined,
      surname: undefined,
      chatId: undefined
    };
  }


}


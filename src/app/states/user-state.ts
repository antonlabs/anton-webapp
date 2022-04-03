import { UserDto } from "../shared/dto/user.dto";
import {State} from "@antonlabs/rack";

export interface UserStateProperties extends UserDto {
  lastEmailRecover?: string,
  withIdp?: boolean;
  pro?: boolean;
}

export class UserState extends State<UserStateProperties> {
  onCreate(): UserStateProperties {
    return {
      identityId: undefined,
      email: '',
      lastEmailRecover: undefined,
      withIdp: undefined,
      avatar: '',
      name: undefined,
      surname: undefined,
      chatId: undefined,
      pro: false
    };
  }

  async refreshState(): Promise<void> {}


}


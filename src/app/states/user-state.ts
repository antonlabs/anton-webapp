import { UserDto } from "../shared/dto/user.dto";
import {State} from "@antonlabs/rack";

export interface UserStateProperties extends UserDto {}

export class UserState extends State<UserStateProperties> {

  onCreate(): UserStateProperties {
    return {
      identityId: undefined,
      email: '',
      avatar: '',
      name: undefined,
      surname: undefined,
      chatId: undefined
    };
  }

  async refreshState(): Promise<void> {}


}


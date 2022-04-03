import { UserDto } from "../shared/dto/user.dto";
import {State} from "@antonlabs/rack";

export interface UserStateProperties extends UserDto {
  lastEmailRecover?: string,
  withIdp?: boolean;
  pro?: boolean;
  lang: 'it' | 'en'
}

export class UserState extends State<UserStateProperties> {
  onCreate(): UserStateProperties {
    let lang: 'it' | 'en' = navigator.language.split('-')[0] as any;
    if(lang !== 'it' && lang !== 'en') {
      lang = 'en';
    }
    return {
      identityId: undefined,
      email: '',
      lastEmailRecover: undefined,
      withIdp: undefined,
      avatar: '',
      name: undefined,
      surname: undefined,
      chatId: undefined,
      pro: false,
      lang
    };
  }

  async refreshState(): Promise<void> {}


}


import {Injectable} from '@angular/core';
import {getUserItem} from "./helpers";

export interface UserState {
  name: string;
}


@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor() {}

  async getUserInfo() {
    return getUserItem('USER');
  }


}

import {Injectable} from '@angular/core';
import {getUserItem} from "./helpers";
import {HttpClient} from "@angular/common/http";
import {firstValueFrom} from "rxjs";
import { states } from '../states/app-state';

export interface UserState {
  email: string;
  name: string;
  avatar: string;
}


@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private httpService: HttpClient) {}

  async getUserInfo() {
    return getUserItem('USER');
  }

  async getGoogleInfos() {
    return firstValueFrom(
      this.httpService.get(`https://oauth2.googleapis.com/tokeninfo?id_token=${states.oAuthCredentials.val.id_token}`)
    );
  }


}

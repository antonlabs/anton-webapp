import {Injectable} from '@angular/core';
import {getUserItem} from "./helpers";
import {HttpClient} from "@angular/common/http";
import { AppState } from '../app-state';
import {firstValueFrom} from "rxjs";

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
      this.httpService.get(`https://oauth2.googleapis.com/tokeninfo?id_token=${AppState.val.oauthCredentials.id_token}`)
    );
  }


}

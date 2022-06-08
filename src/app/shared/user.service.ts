import {Injectable} from '@angular/core';
import {apiG, getUserItem} from "./helpers";
import {HttpClient} from "@angular/common/http";
import {firstValueFrom} from "rxjs";
import {rack} from '../states/app-state';
import {WalletConverter} from "../wallet/converters/wallet.converter";
import {WalletModel} from "../wallet/models/wallet.model";

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
      this.httpService.get(`https://oauth2.googleapis.com/tokeninfo?id_token=${rack.states.oAuthCredentials.val.id_token}`)
    );
  }

  async checkout(): Promise<string> {
    return (await apiG('user/create_checkout_session', {
      method: 'GET'
    }));
  }

  async premiumActive() {
    return (await apiG('user/premium_active', {
      method: 'GET'
    }));
  }


}

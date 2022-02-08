import {Injectable} from '@angular/core';
import {apiG, getUserListItem} from "./helpers";
import {WalletModel} from "../wallet/models/wallet.model";
import {WalletConverter} from "../wallet/converters/wallet.converter";

export interface WalletState {
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class WalletService {

  constructor() {}

  async getWallets() {
    return getUserListItem('WALLET');
  }

  async updateWallet(wallet: WalletModel): Promise<any> {
    return (await apiG('wallet', {
      method: 'PUT',
      body: JSON.stringify(WalletConverter.toDto(wallet))
    })).json();
  }

}

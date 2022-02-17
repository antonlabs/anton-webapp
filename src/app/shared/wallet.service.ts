import {Injectable} from '@angular/core';
import {apiG, documentClient, dynamoDbClient, getUserListItem, refreshWallets} from "./helpers";
import {WalletModel} from "../wallet/models/wallet.model";
import {WalletConverter} from "../wallet/converters/wallet.converter";
import {OrderModel} from "../wallet/models/order.model";
import {AppState} from "../app-state";

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

  async createWallet(wallet: Partial<WalletModel>): Promise<string> {
    const result = await (await apiG('wallet', {
      method: 'POST',
      body: JSON.stringify(WalletConverter.toDto({...AppState.getCurrentWallet(), ...wallet} as WalletModel))
    })).text();
    await refreshWallets();
    return result;
  }

  async updateWallet(wallet: Partial<WalletModel>): Promise<string> {
    const result = await (await apiG('wallet/'+wallet.name, {
      method: 'PUT',
      body: JSON.stringify(WalletConverter.toDto({...AppState.getCurrentWallet(), ...wallet} as WalletModel))
    })).text();
    await refreshWallets();
    return result;
  }

  async getOrders(): Promise<OrderModel[]> {
    return (await getUserListItem<OrderModel>('WALLET')) ?? [];
  }

}

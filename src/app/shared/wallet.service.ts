import {Injectable} from '@angular/core';
import {apiG, documentClient, dynamoDbClient, getUserListItem, refreshWallets} from "./helpers";
import {WalletModel} from "../wallet/models/wallet.model";
import {WalletConverter} from "../wallet/converters/wallet.converter";
import {OrderModel} from "../wallet/models/order.model";

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

  async updateWallet(wallet: WalletModel): Promise<string> {
    const result = await (await apiG('wallet', {
      method: 'PUT',
      body: JSON.stringify(WalletConverter.toDto(wallet))
    })).text();
    await refreshWallets();
    return result;
  }

  async getOrders(): Promise<OrderModel[]> {
    return (await getUserListItem<OrderModel>('WALLET')) ?? [];
  }

}

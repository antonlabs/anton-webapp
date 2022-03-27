import {Injectable} from '@angular/core';
import {apiG, getUserListItem, refreshWallets} from "./helpers";
import {WalletModel} from "../wallet/models/wallet.model";
import {WalletConverter} from "../wallet/converters/wallet.converter";
import {OcoOrderModel, OrderModel} from "../wallet/models/order.model";
import {rack} from "../states/app-state";

export interface WalletState {
  name: string;
}

export type WalletPlan = 'BRONZE' | 'GOLD' | 'SILVER' | 'FREE' | 'PLATINUM';

export type DeleteWalletMethod = 'KEEP_ORDERS' | 'SELL_ORDERS';

@Injectable({
  providedIn: 'root'
})
export class WalletService {
  markets = [
    'BUSD',
    'USDT',
    'EUR'
  ];

  planFees: {[key: string]: number} = {
    FREE: 0,
    BRONZE: 20,
    SILVER: 50,
    GOLD: 75,
    PLATINUM: 100
  }

  planBudgetInterval: {[key: string]: number[]} = {
    FREE: [0, 500],
    BRONZE: [500, 2000],
    SILVER: [2000, 5000],
    GOLD: [5000, 7000],
    PLATINUM: [7000, 10000]
  }

  constructor() {}

  async getWallets() {
    return getUserListItem('WALLET');
  }

  async createWallet(wallet: Partial<WalletModel>): Promise<string> {
    const result = await (await apiG('wallet', {
      method: 'POST',
      body: JSON.stringify(WalletConverter.toDto({...rack.states.currentWallet.val, ...wallet} as WalletModel))
    }));
    await refreshWallets();
    return result;
  }

  async updateWallet(wallet: Partial<WalletModel>): Promise<string> {
    const walletPayload = {...rack.states.currentWallet.val, ...wallet};
    console.log(walletPayload);
    const result = await (await apiG('wallet/'+walletPayload['name'], {
      method: 'PUT',
      body: JSON.stringify(WalletConverter.toDto(walletPayload as WalletModel))
    }));
    await refreshWallets();
    return result;
  }

  async enableBnbFees(walletName: string) {
    await apiG('wallet/'+walletName+'/enable_bnb_fees' , {
      method: 'PUT'
    });
    refreshWallets();
  }

  async playStrategy(walletName: string): Promise<void> {
    await apiG('wallet/'+walletName+'/start' , {
      method: 'PUT'
    });
    refreshWallets();
  }

  async stopStrategy(walletName: string): Promise<void> {
    await apiG('wallet/'+walletName+'/stop' , {
      method: 'PUT'
    });
    refreshWallets();
  }

  getWalletPlan(budget: number): WalletPlan {
    for(const planName of Object.keys(this.planBudgetInterval)) {
      if(budget > this.planBudgetInterval[planName][0] && budget <= this.planBudgetInterval[planName][1]) {
        return planName as WalletPlan;
      }
    }
    return 'FREE';
  }

  async getActualBalance(wallet: WalletModel): Promise<number> {
    return (await apiG('wallet/balance/'+wallet.name, {
      method: 'GET'
    }));
  }

  async deleteWallet(walletName: string, method: DeleteWalletMethod) {
    return (await apiG(`wallet/${walletName}?method=${method}`, {
      method: 'DELETE'
    }));
  }

  async deleteBlacklistSymbol(symbol: string): Promise<void> {
    const wallet = rack.states.currentWallet.val;
    if(wallet) {
      wallet.blacklist = (wallet.blacklist ?? []).filter(item => item !== symbol);
      await this.updateWallet(wallet);
    }
  }

}

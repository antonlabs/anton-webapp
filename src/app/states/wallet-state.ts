import {WalletModel} from "../wallet/models/wallet.model";
import {State} from "@antonlabs/rack";
import {OcoOrderModel, OrderModel} from "../wallet/models/order.model";
import {getOrders, GetTransactionOutput, getTransactions} from "../shared/helpers";

export interface WalletProperties extends WalletModel {
  orders: {[key: string]: OcoOrderModel[]},
  transactions: string[]
}

export class WalletState extends State<WalletProperties> {

  onCreate(): WalletProperties {
    return {
      name: '',
      symbolMarket: undefined,
      units: undefined,
      alias: undefined,
      earnings: undefined,
      totalEarnings: undefined,
      type: undefined,
      accessKey: undefined,
      secretKey: undefined,
      valuePerUnits: undefined,
      blacklist: [],
      transactions: [],
      orders: {}
    };
  }

  async refreshState(): Promise<void> {}

  async refreshTransactions() {
    const transactions = await getTransactions();
    this.set({
      transactions
    });
  }

  async nextPageActiveOrders(types: ('SELL' | 'BUY' | 'HISTORY')[]) {
  }



}

import {WalletModel} from "../wallet/models/wallet.model";
import {State} from "@antonlabs/rack";
import {OcoOrderModel} from "../wallet/models/order.model";
import {apiG, getOrders, getTransactions, PaginationToken} from "../shared/helpers";
import {TransactionModel} from "../core/clients/models/transaction.model";
import {rack} from "./app-state";
import {AccountData} from "../core/clients/models/account/AccountData";

export interface WalletProperties extends WalletModel {
  transactions: {[key: string]: TransactionModel},
  account: AccountData | undefined
}

export class WalletState extends State<WalletProperties> {

  onCreate(): WalletProperties {
    return {
      name: '',
      symbolMarket: undefined,
      alias: undefined,
      earnings: undefined,
      totalEarnings: undefined,
      type: undefined,
      accessKey: undefined,
      secretKey: undefined,
      maxOrderValue: 50,
      budget: 0,
      balances: [],
      blacklist: [],
      transactions: {},
      account: undefined
    };
  }

  async refreshState(): Promise<void> {
    await this.refreshTransactions();
    await this.refreshAccount();
  }

  async refreshTransactions(mode?: 'OPEN' | 'CLOSE', paginationToken?: PaginationToken): Promise<{data: TransactionModel[], lastKey: PaginationToken | undefined}> {
    const response = await getTransactions(mode, paginationToken);
    const transactions = response.data;
    const result: {[key: string] : TransactionModel} = this.val.transactions;
    for(const transaction of transactions) {
      result[transaction.id] = transaction;
    }
    this.set({
      transactions: result
    });
    return response;
  }

  async refreshAccount() {
    this.set({
      account: await (apiG('binance/'+rack.states.currentWallet.val.name, {
        body: JSON.stringify({
          path: '/api/v3/account',
          method: 'GET'
        }),
        method: 'POST'
      })),
    })
  }

  async getSymbolQty(symbol: string): Promise<number> {
    return (await apiG(`wallet/balance/${rack.states.currentWallet.val.name}/qty/${symbol}`, {
      method: 'GET'
    }));
  }

  async getTransactionOrders(transactionId: string): Promise<OcoOrderModel[]> {
    transactionId = transactionId.replace("TRANSACTION#CLOSE#", "");
    transactionId = transactionId.replace("TRANSACTION#OPEN#", "");
    return (await getOrders(transactionId)).sort((a, b) => b.orders.slice(-1)[0].transactTime - a.orders.slice(-1)[0].transactTime) ?? [];
  }



}

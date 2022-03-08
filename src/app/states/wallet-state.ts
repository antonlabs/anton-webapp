import {WalletModel} from "../wallet/models/wallet.model";
import {State} from "@antonlabs/rack";
import {OcoOrderModel, OrderModel} from "../wallet/models/order.model";
import {GetTransactionOutput, getTransactions} from "../shared/helpers";

export interface WalletProperties extends WalletModel {
  orders: GetTransactionOutput<OcoOrderModel>
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
      orders: {
        data: [],
        pagination: {}
      }
    };
  }

  async refreshState(): Promise<void> {}

  async nextPageOrders(types: ('SELL' | 'BUY' | 'HISTORY')[]) {
    const currentData = this.val.orders?.data ?? [];
    const orders = await getTransactions(types, undefined, this.val.orders?.pagination ?? {});
    if(orders) {
      currentData.push(...orders.data);
      this.set({
        orders: {
          data: currentData.sort((a, b) => b.orders[0].transactTime - a.orders[0].transactTime),
          pagination: orders.pagination
        }
      });
    }
  }

  async nextPageActiveOrders(types: ('SELL' | 'BUY' | 'HISTORY')[]) {
    const orders = await getTransactions(types);
    this.set({orders});
  }

  async getOco(orderListId: number): Promise<OcoOrderModel | undefined> {
    const orders = this.val.orders;
    for(const order of (orders?.data ?? [])) {
      if(order.orderListId === orderListId) {
        return order;
      }
    }
    return undefined;
  }

  async getOrder(orderId: number): Promise<OrderModel | undefined> {
    const orders = this.val.orders;
    for(const order of (orders?.data ?? [])) {
      const index = order.orders.findIndex(item => item.orderId === orderId);
      if(index > -1) {
        return order.orders[index];
      }
    }
    return undefined;
  }

}

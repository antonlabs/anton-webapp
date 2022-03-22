import {OrderModel} from "../models/order.model";

export class OrderConverter {

    static fromDynamoModel(order: any): OrderModel {
        return {
          transactionId: order.sk.split('#')[0],
          symbol: order.symbol,
          orderId: order.orderId,
          orderListId: order.orderListId,
          earnings: order.earnings,
          clientOrderId: order.clientOrderId,
          updateTime: order.updateTime,
          transactTime: order.transactTime,
          price: order.price,
          origQty: order.origQty,
          executedQty: order.executeQty,
          stopPrice: parseFloat(order.stopPrice),
          fills: order.fills,
          cummulativeQuoteQty: order.cummulativeQuoteQty,
          status: order.status,
          buyPrice: order.buyPrice,
          timeInForce: order.timeInForce,
          type: order.type,
          side: order.side
        };
    }
}

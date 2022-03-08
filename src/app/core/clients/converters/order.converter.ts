import {OcoOrderModel, OrderModel} from "../models/order.model";

export class OrderConverter {
    static toDynamoModel(order: OrderModel) {
        const ttl = new Date();
        ttl.setMonth(ttl.getMonth() + 1);
        return Object.assign({
            pk: order.symbol,
            sk: `ORDER#${new Date(order.transactTime ?? order.updateTime).toISOString()}#`+order.type,
            ttl
        }, order)
    }

    static fromDynamoModel(order: any): OrderModel {
        return {
            symbol: order.symbol,
            orderId: order.orderId,
            orderListId: order.orderListId,
            clientOrderId: order.clientOrderId,
            updateTime: order.updateTime,
            transactTime: order.transactTime,
            price: order.price,
            origQty: order.origQty,
            executedQty: order.executeQty,
            fills: order.fills,
            cummulativeQuoteQty: order.cummulativeQuoteQty,
            status: order.status,
            timeInForce: order.timeInForce,
            type: order.type,
            alreadyIncrement: order.alreadyIncrement,
            parentOrder: order.parentOrder,
            side: order.side
        };
    }
}

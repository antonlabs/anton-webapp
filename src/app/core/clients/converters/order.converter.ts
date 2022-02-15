import {OrderModel} from "../models/order.model";

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

    static toDto(order: OrderModel) {
        return {
            symbol: order.symbol,
            orderId: order.orderId,
            orderListId: order.orderListId, // Unless OCO, value will be -1
            clientOrderId: order.clientOrderId,
            transactTime: order.transactTime,
            price: order.price,
            origQty: order.origQty,
            alreadyIncrement: order.alreadyIncrement,
            executedQty: order.executedQty,
            fills: order.fills,
            parentOrder: order.parentOrder,
            cummulativeQuoteQty: order.cummulativeQuoteQty,
            status: order.status,
            timeInForce: order.timeInForce,
            type: order.type,
            side: order.side
        }
    }

    static toModel(order: OrderModel) {
        return {
            symbol: order.symbol,
            orderId: order.orderId,
            orderListId: order.orderListId, // Unless OCO, value will be -1
            clientOrderId: order.clientOrderId,
            transactTime: order.transactTime,
            price: order.price,
            parentOrder: order.parentOrder,
            origQty: order.origQty,
            executedQty: order.executedQty,
            fills: order.fills,
            cummulativeQuoteQty: order.cummulativeQuoteQty,
            status: order.status,
            alreadyIncrement: order.alreadyIncrement,
            timeInForce: order.timeInForce,
            type: order.type,
            side: order.side
        }
    }
}

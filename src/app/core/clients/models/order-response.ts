import { Model } from "./model";

export interface OrderFills{
    price: string,
    qty: string,
    commission: string,
    commissionAsset: string,
    tradeId: number
}


export interface OrderResponse extends Model {
    symbol: string,
    orderId: number,
    orderListId: number, // Unless OCO, value will be -1
    clientOrderId: string,
    updateTime?: number,
    stopPrice?: string,
    transactTime: number,
    price: string,
    origQty: string,
    executedQty: string,
    fills: OrderFills[],
    cummulativeQuoteQty: string,
    status: 'CANCELED' | 'EXPIRED' | 'REJECTED' | 'FILLED' | 'NEW' | 'PARTIALLY_FILLED',
    timeInForce: string,
    type: string,
    side: string
}

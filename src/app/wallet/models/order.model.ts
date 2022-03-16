import {OrderResponse} from "./order-response";

export interface OrderModel extends OrderResponse {
    alreadyIncrement?: boolean;
    parentOrder?: OrderModel;
    earnings?: number;
}

export interface OcoOrderModel {
    orderListId: number;
    transactionId: string;
    oco: boolean;
    open?: boolean;
    orders: OrderModel[];
    symbol: string;
}


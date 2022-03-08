import {OrderResponse} from "./order-response";

export interface OrderModel extends OrderResponse {
    alreadyIncrement?: boolean;
    parentOrder?: OrderModel;
}

export interface OcoOrderModel {
    orderListId: number;
    oco: boolean;
    open?: boolean;
    orders: OrderModel[];
    symbol: string;
}


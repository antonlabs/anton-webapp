import {Model} from "./model";
import {OrderResponse} from "./order-response";

export interface OrderModel extends OrderResponse {
  transactionId: string
}

export interface OcoOrderModel {
    orderListId: number;
    orders: OrderModel[];
    orderReports: OrderModel[];
    listOrderStatus: 'EXECUTING' |  'ALL_DONE' | 'REJECT';
    symbol: string;
}

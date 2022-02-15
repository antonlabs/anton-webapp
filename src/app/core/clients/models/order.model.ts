import {Model} from "./model";
import {OrderResponse} from "./order-response";

export interface OrderModel extends OrderResponse {
    alreadyIncrement?: boolean;
    parentOrder?: OrderModel;
}

export interface OcoOrderModel {
    orderListId: number;
    orders: OrderModel[];
    orderReports: OrderModel[];
    listOrderStatus: 'EXECUTING' |  'ALL_DONE' | 'REJECT';
    symbol: string;
}

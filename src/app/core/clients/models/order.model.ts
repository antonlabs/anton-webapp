import {Model} from "./model";
import {OrderResponse} from "./order-response";

export interface OrderModel extends OrderResponse {
  transactionId: string,
  earnings: number
}

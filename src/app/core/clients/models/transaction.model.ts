import {OcoOrderModel} from "../../../wallet/models/order.model";

export interface TransactionModel {
  time: Date,
  id: string,
  symbol: string,
  closed: boolean,
  orders?: OcoOrderModel[]
}

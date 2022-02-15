import { Component, OnInit } from '@angular/core';
import {OrderModel} from "../models/order.model";
import {OrderFills} from "../models/order-response";

@Component({
  selector: 'app-wallet-orders',
  templateUrl: './wallet-orders.component.html',
  styleUrls: ['./wallet-orders.component.scss']
})
export class WalletOrdersComponent implements OnInit {

  orders: OrderModel[] = [
    {
      symbol: 'SHIBBUSD',
      orderId: 12312,
      orderListId: 123, // Unless OCO, value will be -1
      clientOrderId: 'sdf123',
      transactTime: new Date().getDate(),
      price: '23.11',
      type: 'LIMIT',
      side: 'BUY',
      origQty: '122.12',
      executedQty: '122.12',
      fills: [],
      cummulativeQuoteQty: '123',
      status: 'NEW',
      timeInForce: 'GTC'
    }
  ];

  constructor() { }

  ngOnInit(): void {
  }

}

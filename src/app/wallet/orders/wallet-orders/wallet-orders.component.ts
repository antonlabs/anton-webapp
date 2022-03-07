import { Component, OnInit } from '@angular/core';
import {OrderModel} from "../../models/order.model";
import {WalletService} from "../../../shared/wallet.service";

@Component({
  selector: 'app-wallet-orders',
  templateUrl: './wallet-orders.component.html',
  styleUrls: ['./wallet-orders.component.scss']
})
export class WalletOrdersComponent implements OnInit {

  orders: OrderModel[] | undefined;

  constructor(private walletService: WalletService) { }

  ngOnInit(): void {
    this.walletService.getAllOrders().then(orders => this.orders = orders);
  }

}

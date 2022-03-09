import { Component, OnInit } from '@angular/core';
import {OcoOrderModel, OrderModel} from "../../models/order.model";
import {WalletService} from "../../../shared/wallet.service";
import {AntiMemLeak} from "../../../shared/anti-mem-leak";
import {ActivatedRoute} from "@angular/router";
import {orderTypes} from "../../../shared/helpers";
import {rack} from "../../../states/app-state";

@Component({
  selector: 'app-wallet-orders',
  templateUrl: './wallet-orders.component.html',
  styleUrls: ['./wallet-orders.component.scss']
})
export class WalletOrdersComponent extends AntiMemLeak implements OnInit {

  orders: OcoOrderModel[] | undefined;
  currentOrder: OcoOrderModel | undefined;
  types = orderTypes;
  currentOrderId: number | undefined;
  orderListId: number | undefined;

  constructor(
    private walletService: WalletService,
    private activatedRoute: ActivatedRoute
  ) {
    super();
  }

  ngOnInit(): void {
    this.sub.add(
      rack.states.currentWallet.obs.subscribe((wallet) => {
        if(wallet.orders?.data) {
          this.orders = wallet.orders.data;
          this.refreshCurrentOrder();
        }
      })
    );
    rack.states.currentWallet.nextPageOrders(['BUY', 'SELL',  'HISTORY']);
    this.sub.add(this.activatedRoute.queryParams.subscribe((_: any) => {
      this.refreshCurrentOrder();
    }));
  }

  refreshCurrentOrder() {
    this.currentOrderId = parseInt(this.activatedRoute.snapshot.queryParams['order']);
    this.orderListId = parseInt(this.activatedRoute.snapshot.queryParams['orderListId']);
    console.log(this.currentOrderId, this.orderListId);
    if (this.currentOrderId) {
      rack.states.currentWallet.getOrder(this.currentOrderId).then((order) => {
        if(order) {
          this.currentOrder = {
            orderListId: -1,
            oco: false,
            symbol: order.symbol,
            orders: [order]
          };
        }
      });
    } else if(this.orderListId) {
      rack.states.currentWallet.getOco(this.orderListId).then((order) => {
        console.log(order);
        if(order) {
          this.currentOrder = order;
        }
      });
    }
  }

  getTransactTime(order: OrderModel): string {
    return new Date(order.transactTime).toLocaleString();
  }

}

import {Component, Input, OnInit} from '@angular/core';
import {OcoOrderModel, OrderModel} from "../../wallet/models/order.model";
import {orderStatus, orderTypes} from "../helpers";
import {ActivatedRoute, Router} from "@angular/router";
import {AntiMemLeak} from "../anti-mem-leak";


@Component({
  selector: 'app-order-card',
  templateUrl: './order-card.component.html',
  styleUrls: ['./order-card.component.scss']
})
export class OrderCardComponent extends AntiMemLeak implements OnInit {

  @Input() order: OcoOrderModel | undefined;
  @Input() active: boolean | undefined;
  types = orderTypes;
  status = orderStatus;
  selectedOrder: number | undefined;

  constructor(
    private router: Router,
    private activatedRouter: ActivatedRoute
  ) {
    super();
  }

  ngOnInit(): void {
    this.sub.add(
      this.activatedRouter.queryParams.subscribe(queryParams => {
        if(queryParams) {
          this.selectedOrder = parseInt(queryParams['order']);
          if(this.order) {
            if(this.order.orders.findIndex(item => item.orderId === this.selectedOrder) > -1) {
              this.order.open = true;
            }
          }
        }
      })
    );
  }

  get firstOrder(): OrderModel | undefined {
    return this.order?.orders[0];
  }

  goToOrder(order: OrderModel) {
  }

}

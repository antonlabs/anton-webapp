import {Component, Input, OnInit} from '@angular/core';
import {OrderModel} from "../../models/order.model";
import {orderStatus, orderTypes} from "../../../shared/helpers";
import {rack} from "../../../states/app-state";

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss']
})
export class OrderDetailsComponent implements OnInit {

  @Input() orders: OrderModel[] | undefined;
  selectedIndex: number = 0;
  orderTypes = orderTypes;
  orderStatus = orderStatus;

  constructor() { }

  ngOnInit(): void {
  }

  get currentOrder(): OrderModel | undefined {
    if(this.orders) {
      return this.orders[this.selectedIndex];
    }
    return undefined;
  }

  get parentOrder(): OrderModel | undefined {
    return this.currentOrder?.parentOrder;
  }

}

import {Component, Input, OnInit} from '@angular/core';
import {OcoOrderModel, OrderModel} from "../../models/order.model";
import {orderStatus, orderTypes} from "../../../shared/helpers";
import {rack} from "../../../states/app-state";

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss']
})
export class OrderDetailsComponent implements OnInit {

  @Input() oco: OcoOrderModel | undefined;
  selectedIndex: number = 0;
  orderTypes = orderTypes;
  orderStatus = orderStatus;

  constructor() { }

  ngOnInit(): void {
  }

  get currentOrder(): OrderModel | undefined {
    if(this.oco?.orders[this.selectedIndex].earnings) {
      this.oco.orders[this.selectedIndex].status = 'FILLED';
    }
    return this.oco?.orders[this.selectedIndex];
  }

  getLocalTime(time: number) {
    return new Date(time).toLocaleString();
  }

}

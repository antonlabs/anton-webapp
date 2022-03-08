import {Component, Input, OnInit} from '@angular/core';
import {OcoOrderModel, OrderModel} from "../../wallet/models/order.model";
import {orderTypes} from "../helpers";


@Component({
  selector: 'app-order-card',
  templateUrl: './order-card.component.html',
  styleUrls: ['./order-card.component.scss']
})
export class OrderCardComponent implements OnInit {

  @Input() order: OcoOrderModel | undefined;
  types = orderTypes;

  constructor() { }

  ngOnInit(): void {
  }

  get firstOrder(): OrderModel | undefined {
    return this.order?.orders[0];
  }

}

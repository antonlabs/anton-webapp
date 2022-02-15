import {Component, Input, OnInit} from '@angular/core';
import {OrderModel} from "../../wallet/models/order.model";

@Component({
  selector: 'app-order-card',
  templateUrl: './order-card.component.html',
  styleUrls: ['./order-card.component.scss']
})
export class OrderCardComponent implements OnInit {

  @Input() order: OrderModel | undefined;
  constructor() { }

  ngOnInit(): void {
  }

}

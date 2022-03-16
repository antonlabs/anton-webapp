import {Component, Input, OnInit} from '@angular/core';
import {rack} from 'src/app/states/app-state';
import {AntiMemLeak} from "../../../shared/anti-mem-leak";
import {OcoOrderModel} from "../../models/order.model";
import {BarData, LineData} from "lightweight-charts";

@Component({
  selector: 'app-order-inspection',
  templateUrl: './order-inspection.component.html',
  styleUrls: ['./order-inspection.component.scss']
})
export class OrderInspectionComponent extends AntiMemLeak implements OnInit {

  currentOrders: OcoOrderModel[] | undefined;
  currentKlines: BarData[] = [];

  @Input()
  set orders(val: OcoOrderModel[] | undefined) {
    if(JSON.stringify(val) !== JSON.stringify(this.currentOrders)) {
      this.currentOrders = val;
      this.refreshTicks();
    }
  }

  @Input() pro = true;

  constructor() {
    super();
  }

  ngOnInit(): void {
  }

  async refreshTicks(): Promise<void> {
    if(this.currentOrders && this.currentOrders?.length > 0) {
      const client = await rack.states.exchange.getClient();
      if(client) {
        this.currentKlines = (await client.getHistoricalData(
          this.currentOrders[0].symbol,
          this.currentOrders.slice(-1)[0].orders.slice(-1)[0].transactTime - 33332000,
            (this.currentOrders.slice(-1)[0].orders.slice(-1)[0].updateTime ?? this.currentOrders.slice(-1)[0].orders.slice(-1)[0].transactTime)+ 33332000
          )
        ) ?? [];
        console.log(this.currentKlines);
      }
    }
  }

}

import {Component, Input, OnInit} from '@angular/core';
import {rack} from 'src/app/states/app-state';
import {AntiMemLeak} from "../../../shared/anti-mem-leak";
import {ChartPoint} from "../../../shared/anton-chart/anton-chart.component";
import {OrderModel} from "../../models/order.model";
import {LineData, LineStyle, PriceLineOptions} from "lightweight-charts";
import {orderTypes} from "../../../shared/helpers";

@Component({
  selector: 'app-order-inspection',
  templateUrl: './order-inspection.component.html',
  styleUrls: ['./order-inspection.component.scss']
})
export class OrderInspectionComponent extends AntiMemLeak implements OnInit {

  currentOrders: OrderModel[] | undefined;

  @Input()
  set order(val: OrderModel[] | undefined) {
    if(JSON.stringify(val) !== JSON.stringify(this.currentOrders)) {
      this.currentOrders = val;
      this.refreshTicks();
    }
  }

  currentKlines: LineData[] = [];

  constructor() {
    super();
  }

  ngOnInit(): void {
  }

  async refreshTicks(): Promise<void> {
    if(this.currentOrders && this.currentOrders?.length > 0) {
      const client = await rack.states.exchange.getClient();
      if(client) {
        this.currentKlines = (await client.getHistoricalData(this.currentOrders[0].symbol, this.currentOrders[0].transactTime - 3333200)) ?? [];
        console.log(this.currentKlines);
      }
    }
  }

  get priceLines(): PriceLineOptions[] | undefined {
    return (this.currentOrders ?? []).map((order: OrderModel) => ({
      price: parseFloat(order.price),
      title: orderTypes[order.type],
      color: '#c69e38',
      lineWidth: 2,
      lineStyle: LineStyle.Solid,
      axisLabelVisible: true
    }));
  }

}

import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import { rack } from 'src/app/states/app-state';
import {AntiMemLeak} from "../../../shared/anti-mem-leak";
import {ChartPoint} from "../../../shared/anton-chart/anton-chart.component";

@Component({
  selector: 'app-order-inspection',
  templateUrl: './order-inspection.component.html',
  styleUrls: ['./order-inspection.component.scss']
})
export class OrderInspectionComponent extends AntiMemLeak implements OnInit {
  symbol: string | undefined;
  currentKlines: ChartPoint[] = [];

  constructor(private activatedRoute: ActivatedRoute) {
    super();
  }

  ngOnInit(): void {
    this.sub.add(this.activatedRoute.queryParams.subscribe((params: any) => {
      this.symbol = params.symbol;
      this.refreshTicks();
    }));
  }

  async refreshTicks(): Promise<void> {
    const client = await rack.states.exchange.getClient();
    if(client) {
      this.currentKlines = (await client.getHistoricalData(this.symbol!)) ?? [];
      console.log(this.currentKlines);
    }
  }

}

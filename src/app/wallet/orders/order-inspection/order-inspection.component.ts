import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import { rack } from 'src/app/states/app-state';
import {AntiMemLeak} from "../../../shared/anti-mem-leak";
import {ChartPoint} from "../../../shared/anton-chart/anton-chart.component";
import {OrderModel} from "../../models/order.model";
import {WalletService} from "../../../shared/wallet.service";

@Component({
  selector: 'app-order-inspection',
  templateUrl: './order-inspection.component.html',
  styleUrls: ['./order-inspection.component.scss']
})
export class OrderInspectionComponent extends AntiMemLeak implements OnInit {
  order: OrderModel | undefined;
  currentKlines: ChartPoint[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private walletService: WalletService
  ) {
    super();
  }

  ngOnInit(): void {
    this.sub.add(this.activatedRoute.queryParams.subscribe((params: any) => {
      this.walletService.getOrder(parseInt(params.order)).then((order) => {
        console.log(order);
        this.order = order;
        this.refreshTicks();
      });
    }));
  }

  async refreshTicks(): Promise<void> {
    if(this.order) {
      const client = await rack.states.exchange.getClient();
      if(client) {
        this.currentKlines = (await client.getHistoricalData(this.order.symbol)) ?? [];
        console.log(this.currentKlines);
      }
    }
  }

}

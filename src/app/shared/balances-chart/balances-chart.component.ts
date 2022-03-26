import {AfterViewInit, Component, HostListener, OnInit} from '@angular/core';
import {createChart, IChartApi, ISeriesApi, Time} from "lightweight-charts";
import {EarningModel} from "../../wallet/models/earning.model";
import {makeid, themes} from "../order-chart/order-chart.component";
import {rack} from "../../states/app-state";
import {AntiMemLeak} from "../anti-mem-leak";
import {refreshBalances} from "../helpers";

@Component({
  selector: 'app-balances-chart',
  templateUrl: './balances-chart.component.html',
  styleUrls: ['./balances-chart.component.scss']
})
export class BalancesChartComponent extends AntiMemLeak implements OnInit, AfterViewInit {
  chart: IChartApi | undefined;
  chartLines: ISeriesApi<'Line'> | undefined;
  earnings: EarningModel[] = [];
  id: string = makeid(10);
  lastSize: any = {};


  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    const chartContainer = document.getElementById(this.id)!;
    const width = chartContainer?.offsetWidth;
    console.log(width);
    if(width && this.lastSize?.width !== width) {
      this.lastSize.width = width;
      this.chart?.applyOptions({width});
    }
  }

  constructor() {
    super();
  }

  ngOnInit(): void {
    refreshBalances();
    this.sub.add(
      rack.states.currentWallet.obs.subscribe((wallet) => {
        this.chart?.timeScale().fitContent();
        this.chartLines?.setData((wallet.balances ?? []).map(i => ({
          time: (new Date(i.date).getTime() / 1000 as Time),
          value: i.balance
        })));
      })
    );
  }

  ngAfterViewInit() {
    console.log(this.id);
    if(!this.chart) {
      const chartContainer = document.getElementById(this.id)!;
      const width = chartContainer?.offsetWidth ?? 0;
      let height = chartContainer?.offsetHeight ?? 0;
      if(height < 400) height = 400;
      if(width && height) {
        this.chart = createChart(this.id, {
          width,
          height,
          timeScale: {
            timeVisible: true,
            secondsVisible: true
          }
        });
        this.chart.applyOptions(themes.light.chart);
      }
      this.chartLines = this.chart?.addLineSeries({
        priceFormat: {
          type: 'price',
          precision: 2,
          minMove: 0.001
        }
      });
    }
  }


}

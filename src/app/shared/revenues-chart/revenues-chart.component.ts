import {AfterViewInit, Component, HostListener, OnInit} from '@angular/core';
import {createChart, IChartApi, IPriceLine, ISeriesApi, Time} from "lightweight-charts";
import {AntiMemLeak} from "../anti-mem-leak";
import {rack} from "../../states/app-state";
import {EarningModel} from "../../wallet/models/earning.model";
import {makeid, themes} from "../order-chart/order-chart.component";
import {refreshEarnings} from "../helpers";



@Component({
  selector: 'app-revenues-chart',
  templateUrl: './revenues-chart.component.html',
  styleUrls: ['./revenues-chart.component.scss']
})
export class RevenuesChartComponent extends AntiMemLeak implements OnInit, AfterViewInit {
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
    refreshEarnings();
    this.sub.add(
      rack.states.currentWallet.obs.subscribe((wallet) => {
        this.chart?.timeScale().fitContent();
        this.earnings = wallet.earningsHistory ?? [];
        this.chartLines?.setData((wallet.earningsHistory ?? []).map(i => ({
            time: (new Date(i.earningsDate).getTime() / 1000 as Time),
            value: i.earnings
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

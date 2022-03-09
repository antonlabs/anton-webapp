import {AfterViewInit, Component, HostListener, Input, OnInit} from '@angular/core';
import {
  createChart,
  IChartApi,
  IPriceLine,
  ISeriesApi,
  LineData,
  LineStyle,
  PriceLineOptions
} from "lightweight-charts";
import {OrderModel} from "../../wallet/models/order.model";
import {AntiMemLeak} from "../anti-mem-leak";
import {darkTheme, lightTheme} from "../anton-chart/themes";
import { orderTypes } from '../helpers';


const makeid = (length: number) => {
  let result           = '';
  const characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
    result += characters.charAt(Math.floor(Math.random() *
      charactersLength));
  }
  return result;
}

const themes = {
  dark: darkTheme,
  light: lightTheme
}

@Component({
  selector: 'app-order-chart',
  templateUrl: './order-chart.component.html',
  styleUrls: ['./order-chart.component.scss']
})
export class OrderChartComponent extends AntiMemLeak implements OnInit, AfterViewInit {
  chart: IChartApi | undefined;
  id: string = makeid(10);
  lastSize: any = {};
  chartLines: ISeriesApi<'Area'> | undefined;
  loaded = false;
  currentPriceLines: IPriceLine[] = []

  @Input()
  set data(val: {orders: OrderModel[], dataSeries: LineData[]}) {
    if(val) {
      for(const priceLine of this.currentPriceLines) {
        this.chartLines?.removePriceLine(priceLine);
      }
      this.chartLines?.setData(val.dataSeries);
      for(const order of val.orders) {
        if(order.stopPrice) {
          const priceLine = this.chartLines?.createPriceLine({
            price: parseFloat(order.stopPrice),
            color: '#c69e38',
            axisLabelVisible: true,
            title: $localize`Stop`,
            lineWidth: 2,
            lineStyle: LineStyle.Solid
          });
          if(priceLine) {
            this.currentPriceLines.push(priceLine);
          }
        }
        if(order.price) {
          const priceLine = this.chartLines?.createPriceLine({
            price: parseFloat(order.price),
            color: order.side === 'SELL' ? '#700' : '#070',
            axisLabelVisible: true,
            title: orderTypes[order.type],
            lineWidth: 2,
            lineStyle: LineStyle.Solid
          });
          if(priceLine) {
            this.currentPriceLines.push(priceLine);
          }
        }
      }
      this.loaded = true;
    }
  }

  constructor() {
    super();
  }

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

  ngOnInit() {}

  ngAfterViewInit(): void {
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
      this.chart.timeScale().fitContent();
      this.chart.applyOptions(themes.light.chart);
      this.chartLines = this.chart.addAreaSeries({
        priceFormat: {
          type: 'price',
          precision: 9,
          minMove: 0.00001
        }
      });
      this.chartLines.applyOptions(themes.light.series);
    }
  }


}



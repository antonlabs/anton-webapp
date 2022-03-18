import {AfterViewInit, Component, HostListener, Input, OnInit} from '@angular/core';
import {
  BarData,
  createChart,
  IChartApi,
  IPriceLine,
  ISeriesApi,
  LineData,
  LineStyle,
  PriceLineOptions, SeriesMarker, Time
} from "lightweight-charts";
import {OcoOrderModel, OrderModel} from "../../wallet/models/order.model";
import {AntiMemLeak} from "../anti-mem-leak";
import {darkTheme, lightTheme} from "../anton-chart/themes";
import { orderTypes } from '../helpers';
import {OrderResponse} from "../../wallet/models/order-response";


export const makeid = (length: number) => {
  let result           = '';
  const characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
    result += characters.charAt(Math.floor(Math.random() *
      charactersLength));
  }
  return result;
}

export const themes = {
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
  chartCandles: ISeriesApi<'Candlestick'> | undefined;
  chartLines: ISeriesApi<'Line'> | undefined;
  loaded = false;
  currentPriceLines: IPriceLine[] = [];
  pro: boolean | undefined = undefined;

  getColorByOrder(order: OrderResponse): string {
    if(order.status === 'CANCELED' || order.status === 'EXPIRED' || order.status === 'REJECTED') {
      return '#6a6a6a';
    }
    if(order.side === 'BUY') {
      return '#12a123';
    }
    return '#a11211';
  }

  @Input()
  set data(val: {orders: OcoOrderModel[], dataSeries: BarData[], pro: boolean}) {
    if(val) {
      for(const priceLine of this.currentPriceLines) {
        this.chartCandles?.removePriceLine(priceLine);
        this.chartLines?.removePriceLine(priceLine);
      }
      const markers: SeriesMarker<Time>[] = [];
      if(!this.chart) {
        const chartContainer = document.getElementById(this.id)!;
        console.log(chartContainer);
        console.log(val);
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
        }
      }
      if(val.pro !== this.pro && this.chart) {
        this.pro = val.pro;
        if(this.pro) {
          if(this.chartLines) {
            this.chart?.removeSeries(this.chartLines);
          }
          this.chartCandles = this.chart?.addCandlestickSeries({
            upColor: 'rgb(38,166,154)',
            downColor: 'rgb(255,82,82)',
            wickUpColor: 'rgb(38,166,154)',
            wickDownColor: 'rgb(255,82,82)',
            borderVisible: false,
            priceFormat: {
              type: 'price',
              precision: 7,
              minMove: 0.0000001
            }
          });
        }else {
          if(this.chartCandles) {
            this.chart?.removeSeries(this.chartCandles);
          }
          this.chartLines = this.chart?.addLineSeries({
            priceFormat: {
              type: 'price',
              precision: 7,
              minMove: 0.0000001
            }
          });
          console.log('add chart lines', this.chart);
        }
      }
      if(val.pro) {
        this.chartCandles?.setData(val.dataSeries);
      }else {
        this.chartLines?.setData(val.dataSeries.map(i => ({time: i.time, value: i.open})));
      }
      let orderI = 0;
      for(const ocoOrder of val.orders) {
        for(const order of ocoOrder.orders) {
          if(this.pro) {
            if(order.status === 'FILLED') {
              markers.push({
                time: ((order.updateTime ?? order.transactTime) / 1000) as Time,
                text: orderTypes[order.type],
                color: this.getColorByOrder(order),
                position: order.side === 'BUY' ? 'belowBar' : 'aboveBar',
                shape: order.side === 'BUY' ? 'arrowUp' : 'arrowDown'
              });
            }
            if(order.stopPrice) {
              const priceLine = this.chartCandles?.createPriceLine({
                price: parseFloat(order.stopPrice),
                color: this.getColorByOrder(order),
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
              const priceLine = this.chartCandles?.createPriceLine({
                price: parseFloat(order.price),
                color: this.getColorByOrder(order),
                axisLabelVisible: true,
                title: orderTypes[order.type],
                lineWidth: 2,
                lineStyle: LineStyle.Solid
              });
              if(priceLine) {
                this.currentPriceLines.push(priceLine);
              }
            }
          } else {
            if(order.status === 'FILLED') {
              markers.push({
                time: ((order.updateTime ?? order.transactTime) / 1000) as Time,
                text: order.side,
                color: this.getColorByOrder(order),
                position: order.side === 'BUY' ? 'belowBar' : 'aboveBar',
                shape: order.side === 'BUY' ? 'arrowUp' : 'arrowDown'
              });
            }
            if(orderI === 0 || orderI === val.orders.length - 1) {
              if(order.status === 'NEW' && (order.type === 'LIMIT_MAKER' || order.type === 'MARKET')) {
                const priceLine = this.chartLines?.createPriceLine({
                  price: parseFloat(order.price),
                  color: this.getColorByOrder(order),
                  axisLabelVisible: true,
                  title: order.side,
                  lineWidth: 2,
                  lineStyle: LineStyle.Solid
                });
                if(priceLine) {
                  this.currentPriceLines.push(priceLine);
                }
              }
            }
          }
        }
        orderI++;
      }
      if(val.pro) {
        this.chartCandles?.setMarkers(markers.sort((b, a) => (b.time as number) - (a.time as number)));
      }else {
        this.chartLines?.setMarkers(markers.sort((b, a) => (b.time as number) - (a.time as number)));
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
  }


}



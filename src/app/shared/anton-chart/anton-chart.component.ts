import {AfterViewInit, Component, HostListener, Input, OnInit} from '@angular/core';
import {createChart, PriceLineOptions, SeriesMarker} from 'lightweight-charts';
import {darkTheme, lightTheme} from "./themes";

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

export interface ChartPoint {
  time: number,
  value: number
}

@Component({
  selector: 'app-anton-chart',
  templateUrl: './anton-chart.component.html',
  styleUrls: ['./anton-chart.component.scss']
})
export class AntonChartComponent implements OnInit, AfterViewInit {
  chart: any;
  id: string = makeid(10);
  lastSize: any = {};
  chartLines: any;
  loaded = false;
  priceLinesString: string[] = [];

  @Input()
  set priceLines(val: PriceLineOptions[] | undefined) {
    for(const line of (val ?? [])) {
      const string = JSON.stringify(line);
      if(this.priceLinesString.indexOf(string) === -1) {
        const interval = setInterval(() => {
          if(this.chartLines) {
            this.chartLines.createPriceLine(line);
            this.priceLinesString.push(string);
            clearInterval(interval);
          }
        }, 100)
      }
    }
  }

  @Input()
  set markers(val: SeriesMarker<any>[]) {

}

  @Input()
  set line(val: ChartPoint[]) {
    if(val) {
      this.loaded = true;
      this.chartLines.setData(val);
    }
  }

  constructor() { }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    const chartContainer = document.getElementById(this.id)!;
    const width = chartContainer?.offsetWidth;
    console.log(width);
    if(width && this.lastSize?.width !== width) {
      this.lastSize.width = width;
      this.chart.applyOptions({width});
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
          minMove: 0.0000001
        }
      });
      this.chartLines.applyOptions(themes.light.series);
    }
  }

}

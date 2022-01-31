import {AfterViewInit, Component, HostListener, Input, OnInit} from '@angular/core';
import { createChart } from 'lightweight-charts';
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

@Component({
  selector: 'app-anton-chart',
  templateUrl: './anton-chart.component.html',
  styleUrls: ['./anton-chart.component.scss']
})
export class AntonChartComponent implements OnInit, AfterViewInit {
  chart: any;
  id: string = makeid(10);
  lastSize: any = {};

  constructor() { }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    const chartContainer = document.getElementById(this.id)!;
    const width = chartContainer.offsetWidth;
    if(this.lastSize?.width !== width) {
      this.lastSize.width = width;
      this.chart.applyOptions({width});
    }
  }

  ngOnInit() {}

  ngAfterViewInit(): void {
    const chartContainer = document.getElementById(this.id)!;
    const width = chartContainer.offsetWidth;
    const height = chartContainer.offsetHeight;
    this.chart = createChart(this.id, {width, height});
    this.chart.timeScale().fitContent();
    this.chart.applyOptions(themes.light.chart);
    const lines = this.chart.addAreaSeries();
    lines.applyOptions(themes.light.series);
    lines.setData([
      { time: '2019-04-11', value: 80.01 },
      { time: '2019-04-12', value: 96.63 },
      { time: '2019-04-13', value: 100 },
      { time: '2019-04-14', value: 150 },
      { time: '2019-04-15', value: 300 },
      { time: '2019-04-16', value: 200 },
      { time: '2019-04-17', value: 350 },
      { time: '2019-04-18', value: 400 },
      { time: '2019-04-19', value: 350 },
      { time: '2019-04-20', value: 500 },
    ]);
  }

}

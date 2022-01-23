import {AfterViewInit, Component, OnInit} from '@angular/core';
import { createChart } from 'lightweight-charts';

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

@Component({
  selector: 'app-anton-chart',
  templateUrl: './anton-chart.component.html',
  styleUrls: ['./anton-chart.component.scss']
})
export class AntonChartComponent implements OnInit, AfterViewInit {
  chart: any;
  id: string = makeid(10);

  constructor() { }

  ngOnInit() {

  }

  ngAfterViewInit(): void {
    const width = document.getElementById(this.id)?.offsetWidth;
    this.chart = createChart(this.id, {width, height: 400});
    const lines = this.chart.addLineSeries();
    lines.setData([
      { time: '2019-04-11', value: 80.01 },
      { time: '2019-04-12', value: 96.63 },
      { time: '2019-04-13', value: 76.64 },
      { time: '2019-04-14', value: 81.89 },
      { time: '2019-04-15', value: 74.43 },
      { time: '2019-04-16', value: 80.01 },
      { time: '2019-04-17', value: 96.63 },
      { time: '2019-04-18', value: 76.64 },
      { time: '2019-04-19', value: 81.89 },
      { time: '2019-04-20', value: 74.43 },
    ]);
  }

}

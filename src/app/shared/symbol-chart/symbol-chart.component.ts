import {Component, Input, OnInit} from '@angular/core';


declare const TradingView: any;

@Component({
  selector: 'app-symbol-chart',
  templateUrl: './symbol-chart.component.html',
  styleUrls: ['./symbol-chart.component.scss']
})
export class SymbolChartComponent implements OnInit {
  constructor() { }

  @Input() symbol: string | undefined;
  @Input() exchange: string = 'BINANCE';

  ngOnInit(): void {
    if(this.symbol) {
      new TradingView.widget(
        {
          "symbol": `${this.exchange}:${this.symbol}USDT`,
          "interval": "D",
          "autosize": true,
          "timezone": Intl.DateTimeFormat().resolvedOptions().timeZone,
          "theme": "light",
          "style": "1",
          "locale": navigator.language.split('-')[0],
          "toolbar_bg": "#ff0000",
          "enable_publishing": false,
          "container_id": "tradingview_2e483"
        }
      );
    }
  }

}

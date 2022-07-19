import { Component, OnInit } from '@angular/core';
import {rack} from "../../states/app-state";
import {cryptoMap} from "../../crypto-map";

interface SymbolMarket {
  symbol: string;
  percentChange: string;
  price: string;
}


@Component({
  selector: 'app-market-overview',
  templateUrl: './market-overview.component.html',
  styleUrls: ['./market-overview.component.scss']
})
export class MarketOverviewComponent implements OnInit {
  symbols: SymbolMarket[] | undefined;
  cryptoMap = cryptoMap;
  market = 'BUSD';

  constructor() { }

  ngOnInit(): void {
    this.refreshSymbols();
  }

  async refreshSymbols() {
    const symbols = (await rack.states.exchange.getClient()?.getSymbols(this.market)) ?? [];
    this.symbols = (await rack.states.exchange.getClient()?.getAllDailyTicker())?.filter(ticker => symbols.indexOf(ticker.symbol) > -1).map(ticker => ({
      symbol: ticker.symbol,
      percentChange: ticker.priceChangePercent,
      price: ticker.prevClosePrice
    }));
  }

}

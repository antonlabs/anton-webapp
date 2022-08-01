import {AfterViewInit, Component, HostListener, OnInit} from '@angular/core';
import {rack} from "../../states/app-state";
import {cryptoMap} from "../../crypto-map";
import {HttpClient} from "@angular/common/http";
import {AntiMemLeak} from "../../shared/anti-mem-leak";
import {getRisks} from "../../shared/helpers";

interface SymbolMarket {
  symbol: string;
  percentChange: string;
  price: string;
  risk: string | null;
}


@Component({
  selector: 'app-market-overview',
  templateUrl: './market-overview.component.html',
  styleUrls: ['./market-overview.component.scss']
})
export class MarketOverviewComponent extends AntiMemLeak implements OnInit {
  symbols: SymbolMarket[] | undefined;
  allSymbols: SymbolMarket[] | undefined;
  cryptoMap = cryptoMap;
  market = 'USDT';
  page: number = 0;
  chunkSize = 20;

  constructor(private httpService: HttpClient) {
    super();
  }

  ngOnInit(): void {
    this.refreshSymbols();
  }

  @HostListener('body:scroll', ['$event']) // for window scroll events
  onScroll(event: any) {
    if((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
      this.nextPage();
    }
  }

  async refreshSymbols() {
    const symbols = (await rack.states.exchange.getClient()?.getSymbols(this.market)) ?? [];
    const risks = await getRisks();
    console.log(risks);
    this.allSymbols = (await rack.states.exchange.getClient()?.getAllDailyTicker())?.filter(ticker => symbols.indexOf(ticker.symbol) > -1 && risks.find(i => ticker.symbol.startsWith(i.symbol)))
      .map(ticker => {
        let risk = risks.find(i => ticker.symbol.startsWith(i.symbol))?.risk ?? null;
        if(risk) {
          const riskN = parseFloat(risk);
          if(riskN < 0.1) {
            risk = 'STABLE';
          }else if(riskN > 0.01 && riskN < 1.3) {
            risk = 'LOW'
          }else if(riskN >= 1.3 && riskN < 2.1) {
            risk = 'MEDIUM'
          }else if(riskN >= 2.1) {
            risk = 'HIGH'
          }
        }
        return {
          symbol: ticker.symbol.replace(this.market, ''),
          percentChange: ticker.priceChangePercent,
          price: ticker.prevClosePrice,
          risk
        }
      });
    this.symbols = this.allSymbols?.slice(this.page, this.page + this.chunkSize);
  }

  nextPage() {
    this.page += this.chunkSize;
    this.symbols?.push(...(this.allSymbols ?? []).slice(this.page, this.page + this.chunkSize));
  }



  @HostListener("window:scroll", ["$event"])
  onWindowScroll() {
    let pos = (document.documentElement.scrollTop || document.body.scrollTop) + document.documentElement.offsetHeight;
    let max = document.documentElement.scrollHeight;
    if(pos == max )   {
      this.nextPage();
      //Do your action here
    }
  }

}

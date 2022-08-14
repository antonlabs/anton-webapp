import {AfterViewInit, Component, HostListener, OnInit} from '@angular/core';
import {rack} from "../../states/app-state";
import {cryptoMap} from "../../crypto-map";
import {HttpClient} from "@angular/common/http";
import {AntiMemLeak} from "../../shared/anti-mem-leak";
import {apiG, getRisks} from "../../shared/helpers";
import {SymbolMarket} from "../models/market.model";



@Component({
  selector: 'app-market-overview',
  templateUrl: './market-overview.component.html',
  styleUrls: ['./market-overview.component.scss']
})
export class MarketOverviewComponent extends AntiMemLeak implements OnInit {
  symbols: SymbolMarket[] | undefined;
  cryptoMap = cryptoMap;
  market = 'USDT';
  page: number = 0;
  chunkSize = 20;

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.sub.add(
      rack.states.market.obs.subscribe(market => {
        this.market = market.market;
      })
    );
    this.refreshSymbols();
  }

  @HostListener('body:scroll', ['$event']) // for window scroll events
  onScroll(event: any) {
    if((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
      this.nextPage();
    }
  }

  async refreshSymbols() {
    await rack.states.market.refreshState();
    this.symbols = rack.states.market.val.symbols?.slice(this.page, this.page + this.chunkSize);
  }

  nextPage() {
    this.page += this.chunkSize;
    this.symbols?.push(...(rack.states.market.val.symbols ?? []).slice(this.page, this.page + this.chunkSize));
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

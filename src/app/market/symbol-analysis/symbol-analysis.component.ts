import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { cryptoMap } from 'src/app/crypto-map';
import { rack } from 'src/app/states/app-state';
import {AntiMemLeak} from "../../shared/anti-mem-leak";

@Component({
  selector: 'app-symbol-analysis',
  templateUrl: './symbol-analysis.component.html',
  styleUrls: ['./symbol-analysis.component.scss']
})
export class SymbolAnalysisComponent extends AntiMemLeak implements OnInit {

  symbol: string | undefined;
  cryptoMap = cryptoMap;
  price: string | undefined;


  constructor(
    private router: Router,
    private activateRouter: ActivatedRoute
  ) {
    super();
  }

  ngOnInit(): void {
    this.sub.add(
      this.activateRouter.params.subscribe((params: any) => {
        this.symbol = params.symbolId;
        if(this.symbol) {
          this.price = rack.states.market.getSymbol(this.symbol)?.price;
        }
      })
    );
    this.sub.add(
      rack.states.market.obs.subscribe(market => {
        console.log(market);
        if(this.symbol) {
          this.price = rack.states.market.getSymbol(this.symbol)?.price;
        }
      })
    );
    rack.states.market.refreshState();
  }

}

import { Component, OnInit } from '@angular/core';
import {StrategyStateType, WalletModel} from "../models/wallet.model";
import {rack} from "../../states/app-state";
import {refreshBalances} from "../../shared/helpers";
import {AntiMemLeak} from "../../shared/anti-mem-leak";
import {Balance} from "../../core/clients/models/account/Balance";
import {SymbolMarket} from "../../market/models/market.model";

@Component({
  selector: 'app-portfolio-card',
  templateUrl: './portfolio-card.component.html',
  styleUrls: ['./portfolio-card.component.scss']
})
export class PortfolioCardComponent extends AntiMemLeak implements OnInit {
  wallet: WalletModel | undefined;
  portfolio: SymbolMarket[] | undefined;

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.sub.add(
      rack.states.currentWallet.obs.subscribe(wallet => {
        this.wallet = wallet;
        if(this.wallet.name) {
          if(wallet.balances.length === 0) {
            refreshBalances();
          }
        }
        this.refreshPortfolio();
      })
    );
    this.sub.add(
      rack.states.market.obs.subscribe(market => {
        this.refreshPortfolio();
      })
    );
  }

  refreshPortfolio() {
    this.portfolio = (rack.states.currentWallet.val.account?.balances ?? [])
      .filter((item: Balance) => parseFloat(item.free) > 0 || parseFloat(item.locked) > 0)
      .map(item => {
        const symbolMarket = rack.states.market.getSymbol(item.asset);
        return {
          symbol: item.asset,
          qty: parseFloat(item.free) + parseFloat(item.locked),
          risk: symbolMarket?.risk ?? null,
          price: symbolMarket?.price ?? 'N/A',
          percentChange: symbolMarket?.percentChange ?? 'N/A'
        }
      });
  }

  get walletBalance(): number | undefined {
    return this.wallet?.balances.slice(-1)[0]?.balance;
  }


  get totalPercentage(): number | undefined {
    if(this.wallet?.totalEarnings !== undefined && this.wallet?.budget !== undefined) {
      return ((this.wallet.totalEarnings) / (this.wallet.budget)) * 100;
    }
    return undefined;
  }

  get totalEarnings(): number | undefined {
    if(this.wallet?.totalEarnings !== undefined) {
      return this.wallet.totalEarnings;
    }
    return undefined;
  }

}

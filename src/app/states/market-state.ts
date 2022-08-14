import {State} from "@antonlabs/rack";
import {apiG, getOrders, getRisks, getTransactions, PaginationToken} from "../shared/helpers";
import {rack} from "./app-state";
import {SymbolMarket} from "../market/models/market.model";

export interface MarketProperties {
  market: string;
  symbols: SymbolMarket[]
}

export class MarketState extends State<MarketProperties> {

  onCreate(): MarketProperties {
    return {
      market: 'USDT',
      symbols: []
    };
  }

  getSymbol(symbol: string): SymbolMarket | undefined {
    return (this.val.symbols ?? []).find(i => i.symbol === symbol);
  }

  getHighRisk() {
    return (this.val.symbols ?? []).filter(item => item.risk === 'HIGH');
  }

  getMediumRisk() {
    return (this.val.symbols ?? []).filter(item => item.risk === 'MEDIUM');
  }

  getLowRisk() {
    return (this.val.symbols ?? []).filter(item => item.risk === 'LOW');
  }

  getStableRisk() {
    return (this.val.symbols ?? []).filter(item => item.risk === 'STABLE');
  }

  async refreshState(): Promise<void> {
    const symbols = (await rack.states.exchange.getClient()?.getSymbols(this.val.market)) ?? [];
    const risks = await getRisks();
    this.set({
      symbols: (await rack.states.exchange.getClient()?.getAllDailyTicker())?.filter(ticker => symbols.indexOf(ticker.symbol) > -1 && risks.find(i => ticker.symbol.replace(this.val.market, "") === i.symbol))
        .map(ticker => {
          let risk = risks.find(i => ticker.symbol.replace(this.val.market, "") === i.symbol)?.risk ?? null;
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
            symbol: ticker.symbol.replace(this.val.market, ''),
            percentChange: ticker.priceChangePercent,
            price: ticker.lastPrice,
            risk
          }
        })
    });
  }

}

import { environment } from "src/environments/environment";
import { BinanceClient } from "../core/clients/binance-client";
import { ExchangeClient } from "../core/clients/exchange-client";
import {TitleModel} from "../core/clients/models/title.model";
import {rack} from "./app-state";
import {State} from "@antonlabs/rack";

export interface ExchangeProperties {
  titles: TitleModel;
}


export class ExchangeState extends State<ExchangeProperties> {

  getClient(): ExchangeClient | undefined {
    return new BinanceClient(
      environment.binanceEndpoint,
      rack.states.currentWallet?.val.accessKey ?? '',
      rack.states.currentWallet?.val.secretKey ?? '',
    );
  }

  onCreate(): ExchangeProperties {
    return {
      titles: {}
    };
  }

  async refreshState(): Promise<void> {
    const market = rack.states.currentWallet.val.symbolMarket;
    console.log(market, Object.keys(this.val.titles).length);
    if(market && Object.keys(this.val.titles).length === 0) {
      this.set({
        titles: await this.getClient()?.getPrices(market)
      });
    }
  }
}

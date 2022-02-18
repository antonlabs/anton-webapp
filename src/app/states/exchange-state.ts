import { environment } from "src/environments/environment";
import { BinanceClient } from "../core/clients/binance-client";
import { ExchangeClient } from "../core/clients/exchange-client";
import {TitleModel} from "../core/clients/models/title.model";
import { states } from "./app-state";
import {State} from "./state";

export interface ExchangeProperties {
  titles: TitleModel;
}


export class ExchangeState extends State<ExchangeProperties> {

  empty(): ExchangeProperties {
    return {
      titles: {}
    };
  }

  getClient(): ExchangeClient | undefined {
    return new BinanceClient(
      environment.binanceEndpoint,
      states.currentWallet?.val.accessKey ?? '',
      states.currentWallet?.val.secretKey ?? '',
    );
  }
}

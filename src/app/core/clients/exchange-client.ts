import {TitleModel} from "./models/title.model";
import {DailyTickerModel} from "./models/daily-ticker.model";
import {TradeInfoModel} from "./models/trade-info.model";
import {OrderResponse} from "./models/order-response";
import {OrderModel} from "./models/order.model";
import * as crypto from 'crypto-js';
import * as querystring from 'querystring';
import { ChartPoint } from "src/app/shared/anton-chart/anton-chart.component";


export abstract class ExchangeClient {

    requestsChunks = 100;

    constructor(
        protected url: string,
        protected apikey: string,
        protected apiSecret: string
    ) {};

    signBytes(msg: string): string {
        console.log('Signing', msg, this.apiSecret);

        return crypto.HmacSHA256(msg, this.apiSecret).toString(crypto.enc.Hex);
    }

    async prepareRequest(endpoint: string, method: string, signed: boolean, params: {[key: string]: any} = {}) {
        console.log('Calling url', this.url + endpoint, signed);
        for(const key of Object.keys(params)) {
          if(params[key] === undefined) {
            delete params[key];
          }
        }
        if (signed) {
            params = {...params, ...{timestamp: Date.now()}};
            params = {...params, ...{signature: this.signBytes(querystring.encode(params))}};
        }
        const url = new URL(this.url + endpoint);
        url.search = new URLSearchParams(params).toString();
        return (await fetch(url.toString(), {
          headers: signed ? new Headers({'X-MBX-APIKEY': this.apikey}) : new Headers(),
          method
        })).json();
    }

    abstract getExchangeInfo(): Promise<any>;

    abstract getDailyTicker(symbol: string): Promise<DailyTickerModel>;

    abstract getFeeInfo(symbol: string): Promise<TradeInfoModel[]>;

    abstract getTicks(): Promise<{ [key: string]: string }>;

    abstract getPercentPrice(): Promise<{ [key: string]: { multiplierUp: number, multiplierDown: number } }>;

    abstract getOrder(symbol: string, orderId: number): Promise<OrderResponse>;

    abstract cancelOrder(symbol: string, orderId: number): Promise<OrderResponse>;

    abstract getMinNotional(): Promise<{ [key: string]: string }>;

    abstract getStepSizes(): Promise<{ [key: string]: string }>;

    abstract getPrices(symbolMarket: string): Promise<TitleModel>;

    abstract getPrice(symbol: string): Promise<number>;

    abstract getPriceWithPrecision(price: number, precision: string): number;

    abstract buyTitle(symbol: string, price: number, quantity: number): Promise<OrderModel>;

    abstract stopLossMarket(symbol: string, price: number, quantity: number): Promise<OrderModel>;

    abstract stopLoss(symbol: string, price: number, quantity: number, actualPrice: number): Promise<OrderModel>;

    abstract sellTitleMarket(symbol: string, price: number, quantity: number): Promise<OrderModel>;

    abstract sellTitle(symbol: string, price: number, quantity: number, currentPrice: number): Promise<OrderModel>;

    abstract getSymbols(market: string): Promise<string[]>;

    abstract getHistoricalData(symbol: string, startTime?: number, endTime?: number): Promise<ChartPoint[]>;

    abstract getActualBalance(symbolMarket: string): Promise<number>;

}



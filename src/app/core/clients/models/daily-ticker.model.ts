import {Model} from "./model";

export interface DailyTickerModel extends Model {
    symbol: string,
    priceChange: string,
    priceChangePercent: string,
    weightedAvgPrice: string,
    prevClosePrice: string,
    lastPrice: string,
    lastQty: string,
    bidPrice: string,
    askPrice: string,
    bidQty: string,
    askQty: string,
    openPrice: string,
    highPrice: string,
    lowPrice: string,
    volume: string,
    quoteVolume: string,
    openTime: number,
    closeTime: number,
    firstId: number,
    lastId: number,
    count: number
}

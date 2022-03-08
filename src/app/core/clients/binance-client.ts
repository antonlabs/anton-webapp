import {ExchangeClient} from './exchange-client';
import {TradeInfoModel} from "./models/trade-info.model";
import {DailyTickerModel} from "./models/daily-ticker.model";
import {OrderResponse} from "./models/order-response";
import {TitleModel} from "./models/title.model";
import { PricesConverter } from './converters/prices.converter';
import {OcoOrderModel, OrderModel} from "./models/order.model";
import {KlineModel} from "./models/kline.model";
import {AccountInformationConverter} from "./converters/account-information.converter";
import {AccountInformationModel} from "./models/account-information.model";
import { ChartPoint } from 'src/app/shared/anton-chart/anton-chart.component';
import {LineData, UTCTimestamp } from 'lightweight-charts';

export let globalExchangeInfo: any | undefined;

export class BinanceClient extends ExchangeClient {
    ticks: {[key: string]: string} | undefined;
    percentPrice: {[key: string]: {multiplierUp: number, multiplierDown: number}} | undefined;
    stepSizes: {[key: string]: string} | undefined;
    minNotional: {[key: string]: string} | undefined;

    constructor(
        url: string,
        apikey: string,
        apiSecret: string
    ) {
        super(
            url,
            apikey,
            apiSecret
        );
    }

    async getExchangeInfo(): Promise<any> {
        if(!globalExchangeInfo) {
            globalExchangeInfo = (await this.prepareRequest('/api/v3/exchangeInfo', 'GET', false));
        }
        return globalExchangeInfo;
    }

    async getDailyTicker(symbol: string): Promise<DailyTickerModel> {
        return (await this.prepareRequest('/api/v3/ticker/24hr', 'GET', false, {symbol}));
    }

    async getFeeInfo(symbol: string): Promise<TradeInfoModel[]> {
        return (await this.prepareRequest('/sapi/v1/asset/tradeFee', 'GET', true, {symbol, timestamp: new Date().toISOString()}));
    }

    async getTicks(): Promise<{[key: string]: string}> {
        const exchangeInfo = await this.getExchangeInfo();
        const result: {[key: string]: string} = {};
        exchangeInfo.symbols.forEach((item: any) => result[item.symbol] = item.filters.filter((filter: any) => filter.filterType === 'PRICE_FILTER')[0].tickSize);
        this.ticks = result;
        return result;
    }

    async getPercentPrice(): Promise<{[key: string]: {multiplierUp: number, multiplierDown: number}}> {
        const exchangeInfo = await this.getExchangeInfo();
        const result: {[key: string]: {multiplierUp: number, multiplierDown: number}} = {};
        exchangeInfo.symbols.forEach((item: any) => {
            const info = item.filters.filter((filter: any) => filter.filterType === 'PERCENT_PRICE')[0];
            result[item.symbol] = {
                multiplierUp: info.multiplierUp,
                multiplierDown: info.multiplierDown
            };
        });
        this.percentPrice = result;
        return result;
    }

    async getOrder(symbol: string, orderId: number): Promise<OrderResponse> {
        return (await this.prepareRequest('/api/v3/order', 'GET', true, {symbol, orderId}));
    }

    async cancelOrder(symbol: string, orderId: number): Promise<OrderResponse> {
        return (await this.prepareRequest('/api/v3/order', 'DELETE', true, {symbol, orderId}));
    }

    async getMinNotional(): Promise<{[key: string]: string}> {
        const exchangeInfo = await this.getExchangeInfo();
        const result: {[key: string]: string} = {};
        exchangeInfo.symbols.forEach((item: any) => result[item.symbol] = item.filters.filter((filter: any) => filter.filterType === 'MIN_NOTIONAL')[0].minNotional);
        this.minNotional = result;
        return result;
    }

    async getStepSizes(): Promise<{[key: string]: string}> {
        const exchangeInfo = await this.getExchangeInfo();
        const result: {[key: string]: string} = {};
        exchangeInfo.symbols.forEach((item: any) => result[item.symbol] = item.filters.filter((filter: any) => filter.filterType === 'LOT_SIZE')[0].stepSize);
        this.stepSizes = result;
        return result;
    }

    async getPrices(symbolMarket: string): Promise<TitleModel> {
        return PricesConverter.pricesConverter((await this.prepareRequest('/api/v3/ticker/price', 'GET', false)), symbolMarket);
    }

    async getPrice(symbol: string): Promise<number> {
        return parseFloat((await this.prepareRequest('/api/v3/ticker/price', 'GET', false, {
            symbol
        })).price)
    }

    getPriceWithPrecision(price: number, precision: string): number {
        console.log('GET PRICE WITH PRECISION', price, precision);
        const int = precision.split('.')[0];
        const decimal = precision.split('.')[1];
        if(int === '0') {
            const endOffset = decimal.split('1')[0].length + 1;
            const priceInt = price.toString().split('.')[0];
            const priceDecimal = price.toString().split('.')[1];
            return priceDecimal ? parseFloat(priceInt + '.' + priceDecimal.slice(0, endOffset)) : parseInt(priceInt, 10);
        }
        return Math.floor(price);
    }

    async getOco(orderListId: number): Promise<OcoOrderModel> {
        const result: OcoOrderModel = (await this.prepareRequest('/api/v3/orderList', 'GET', true, {
            orderListId
        }));
        return result;
    }

    async newOco(symbol: string, priceLimit: number, priceStop: number, quantity: number): Promise<OcoOrderModel> {
        if (!(symbol && priceStop)) throw new Error('TITLE AND PRICE MANDATORY');
        if(!this.ticks || !this.ticks[symbol]) throw new Error('Tick no present for title' + symbol);
        if(!this.stepSizes || !this.stepSizes[symbol]) throw new Error('Step size no present for title' + symbol);
        const priceLimitPrecision = this.getPriceWithPrecision(priceLimit, this.ticks[symbol]);
        const priceStopPrecision = this.getPriceWithPrecision(priceStop, this.ticks[symbol]);
        const priceStopLimitPrecision = this.getPriceWithPrecision(priceStop + (priceStop * 0.004), this.ticks[symbol]);
        const quantityPrecision = this.getPriceWithPrecision(quantity, this.stepSizes[symbol]);
        const result = (await this.prepareRequest('/api/v3/order/oco', 'POST', true, {
            symbol,
            side: 'SELL',
            newOrderRespType: 'FULL',
            price: priceLimitPrecision,
            stopLimitPrice: priceStopLimitPrecision,
            stopLimitTimeInForce: 'GTC',
            stopPrice: priceStopPrecision,
            quantity: quantityPrecision
        }));
        console.warn(result);
        return result;
    }

    async cancelOco(symbol: string, orderListId: number): Promise<OrderModel> {
        const result = (await this.prepareRequest('/api/v3/orderList', 'DELETE', true, {
            symbol,
            orderListId,
        }));
        console.warn(result);
        return result;
    }

    async buyTitle(symbol: string, price: number, quantity: number, retries: number = 3, type: string = 'LIMIT_MAKER'): Promise<OrderModel> {
        if (!(symbol && price)) throw new Error('TITLE AND PRICE MANDATORY');
        if(!this.ticks || !this.ticks[symbol]) throw new Error('Tick no present for title' + symbol);
        if(!this.stepSizes || !this.stepSizes[symbol]) throw new Error('Step size no present for title' + symbol);
        const quantityPrecision = this.getPriceWithPrecision(quantity, this.stepSizes[symbol]);
        const request: any = {
            type,
            symbol,
            side: 'BUY',
            newOrderRespType: 'FULL',
            quantity: quantityPrecision
        };
        if(type !== 'MARKET') {
            request.price = this.getPriceWithPrecision(price, this.ticks[symbol]);
        }
        if(type === 'LIMIT') {
            request.timeInForce = 'GTC';
        }
        try {
            const result = (await this.prepareRequest('/api/v3/order', 'POST', true, request));
            console.warn(result);
            return result;
        }catch(e) {
            console.warn(e);
            retries--;
            if(retries === 0) {
                throw e;
            }
            await new Promise((resolve) => setTimeout(() => resolve(''), 1000))
            return this.buyTitle(symbol, price, quantity, retries);
        }
    }

    async getOrderBook(symbol: string): Promise<{bids: string[][], asks: string[][]}> {
        return (await this.prepareRequest('/api/v3/depth', 'GET', false, {
            symbol,
            limit: 5000
        }));
    }

    async stopLossMarket(symbol: string, price: number, quantity: number): Promise<OrderModel> {
        if (!(symbol && price)) throw new Error('TITLE AND PRICE MANDATORY');
        if(!this.ticks || !this.ticks[symbol]) throw new Error('Tick no present for title' + symbol);
        if(!this.stepSizes || !this.stepSizes[symbol]) throw new Error('Step size no present for title' + symbol);
        const stopPrice = this.getPriceWithPrecision(price - (price * 0.005), this.ticks[symbol]);
        const quantityPrecision = this.getPriceWithPrecision(quantity, this.stepSizes[symbol]);
        try {
            const result = (await this.prepareRequest('/api/v3/order', 'POST', true, {
                type: 'STOP_LOSS_LIMIT',
                symbol,
                stopPrice,
                price: stopPrice,
                timeInForce: 'GTC',
                newOrderRespType: 'FULL',
                side: 'SELL',
                quantity: quantityPrecision
            }));
            console.warn(result);
            return result;
        }catch(e: any) {
            console.warn(e);
            const errorCode = e.response.code;
            console.log('ERROR CODE', errorCode);
            if(errorCode == -1013) {
                return this.sellTitleMarket(symbol, quantity);
            }else {
                throw e;
            }
        }
    }

    async rawOrder(symbol: string, stopPrice: number, price: number, quantity: number): Promise<OrderModel> {
        if(!this.ticks || !this.ticks[symbol]) throw new Error('Tick no present for title' + symbol);
        if(!this.stepSizes || !this.stepSizes[symbol]) throw new Error('Step size no present for title' + symbol);
        const pricePrecision = this.getPriceWithPrecision(price, this.ticks[symbol]);
        const quantityPrecision = this.getPriceWithPrecision(quantity, this.stepSizes[symbol]);
        return (await this.prepareRequest('/api/v3/order', 'POST', true, {
            type: 'STOP_LOSS_LIMIT',
            symbol,
            timeInForce: 'GTC',
            newOrderRespType: 'FULL',
            stopPrice,
            side: 'SELL',
            pricePrecision,
            quantityPrecision
        }));
    }

    async stopLoss(symbol: string, price: number, quantity: number, actualPrice: number): Promise<OrderModel> {
        if (!(symbol && price)) throw new Error('TITLE AND PRICE MANDATORY');
        if(!this.ticks || !this.ticks[symbol]) throw new Error('Tick no present for title' + symbol);
        if(!this.stepSizes || !this.stepSizes[symbol]) throw new Error('Step size no present for title' + symbol);
        const pricePrecision = this.getPriceWithPrecision(price, this.ticks[symbol]);
        const stopPrice = this.getPriceWithPrecision(price - (price * 0.005), this.ticks[symbol]);
        const quantityPrecision = this.getPriceWithPrecision(quantity, this.stepSizes[symbol]);
        try {
            const result = (await this.prepareRequest('/api/v3/order', 'POST', true, {
                type: 'STOP_LOSS_LIMIT',
                symbol,
                timeInForce: 'GTC',
                newOrderRespType: 'FULL',
                stopPrice,
                side: 'SELL',
                price: pricePrecision,
                quantity: quantityPrecision
            }));
            console.warn(result);
            return result;
        }catch(e: any) {
            const errorCode = e.response.code;
            console.log('ERROR CODE', errorCode);
            if(errorCode == -2010) {
                price += (price * 0.01);
                return this.sellTitle(symbol, price, quantity, actualPrice);
            }else {
                throw e;
            }
        }
    }

    async getDailyTickers(): Promise<DailyTickerModel[]> {
        return (await this.prepareRequest('/api/v3/ticker/24hr', 'GET', false));
    }

    async getHotSymbols(): Promise<DailyTickerModel[]> {
        const tickers = await this.getDailyTickers();
        const symbols = tickers.filter(item => item.symbol.endsWith('BUSD'));
        return symbols.sort((a, b) => parseFloat(b.volume) - parseFloat(a.volume)).slice(0, 20);
    }

    async getHistoricalData(symbol: string, startTime?: number, endTime?: number, interval = '5m', limit = 1000): Promise<LineData[]> {
        const result: LineData[] = [];
        const matrix: string[][] = (await this.prepareRequest('/api/v3/klines', 'GET', false, {
            symbol,
            limit,
            startTime,
            endTime,
            interval
        }));

        matrix.forEach((item: any[]) => {
          const timestamp = (item[0] / 1000) as UTCTimestamp;
          return result.push({
            time: timestamp,
            value: parseFloat(item[1])
          })
        })

        console.log(result);
        return result;
    }

    async getCompleteHistoricalData(symbol: string, startTime?: number, endTime?: number, interval = '5m', limit = 1000): Promise<KlineModel[]> {
        const result: KlineModel[] = [];
        const matrix: string[][] = (await this.prepareRequest('/api/v3/klines', 'GET', false, {
            symbol,
            limit,
            startTime,
            endTime,
            interval
        }));
        matrix.forEach((item: string[]) => result.push(
            {
                openTime: parseFloat(item[0]),
                open: parseFloat(item[1]),
                high: parseFloat(item[2]),
                low: parseFloat(item[3]),
                close: parseFloat(item[4]),
                volume: parseFloat(item[5])
            }
        ))
        return result;
    }


    async sellTitleMarket(symbol: string, quantity: number, price?: number, retries = 3): Promise<OrderModel> {
        if (!(symbol)) throw new Error('TITLE MANDATORY');
        if(!this.ticks || !this.ticks[symbol]) throw new Error('Tick no present for title' + symbol);
        if(!this.stepSizes || !this.stepSizes[symbol]) throw new Error('Step size no present for title' + symbol);
        if(!price) {
            price = this.getPriceWithPrecision(await this.getPrice(symbol), this.ticks[symbol]);
        }
        const quantityPrecision = this.getPriceWithPrecision(quantity, this.stepSizes[symbol]);
        const requestMaker = {
            type: 'LIMIT_MAKER',
            symbol,
            newOrderRespType: 'FULL',
            price: this.getPriceWithPrecision(price, this.ticks[symbol]),
            side: 'SELL',
            quantity: quantityPrecision
        };

        const requestMarket = {
            type: 'MARKET',
            symbol,
            newOrderRespType: 'FULL',
            side: 'SELL',
            quantity: quantityPrecision
        };
        try {
            const result = (await this.prepareRequest('/api/v3/order', 'POST', true, requestMaker));
            console.warn(result);
            return result;
        }catch(e) {
            console.warn(e);
            retries--;
            if(retries === 0) {
                const result = (await this.prepareRequest('/api/v3/order', 'POST', true, requestMarket));
                return result;
            }
            await new Promise((resolve) => setTimeout(() => resolve(''), 1000))
            return this.sellTitleMarket(symbol, quantity, price + (price * 0.0008), retries);
        }
    }

    async sellMaker(symbol: string, price: number, quantity: number, retries: number = 3): Promise<OrderModel> {
        if (!(symbol && price)) throw new Error('TITLE AND PRICE MANDATORY');
        if(!this.ticks || !this.ticks[symbol]) throw new Error('Tick no present for title' + symbol);
        if(!this.stepSizes || !this.stepSizes[symbol]) throw new Error('Step size no present for title' + symbol);
        const pricePrecision = this.getPriceWithPrecision(price, this.ticks[symbol]);
        const quantityPrecision = this.getPriceWithPrecision(quantity, this.stepSizes[symbol]);
        try {
            const result = (await this.prepareRequest('/api/v3/order', 'POST', true, {
                type: 'LIMIT_MAKER',
                symbol,
                side: 'SELL',
                newOrderRespType: 'FULL',
                price: pricePrecision,
                quantity: quantityPrecision
            }));
            console.warn(result);
            return result;
        }catch(e) {
            console.warn(e);
            retries--;
            if(retries === 0) {
                throw e;
            }
            await new Promise((resolve) => setTimeout(() => resolve(''), 1000))
            return this.sellMaker(symbol, price, quantity, retries);
        }
    }

    async sellTitle(symbol: string, price: number, quantity: number, currentPrice: number): Promise<OrderModel> {
        if (!(symbol && price)) throw new Error('TITLE AND PRICE MANDATORY');
        if(!this.ticks || !this.ticks[symbol]) throw new Error('Tick no present for title' + symbol);
        if(!this.stepSizes || !this.stepSizes[symbol]) throw new Error('Step size no present for title' + symbol);
        if(!this.percentPrice || !this.percentPrice[symbol]) throw new Error('Percent price no present for title' + symbol);
        if(price > currentPrice * this.percentPrice[symbol].multiplierUp) {
            price = currentPrice * this.percentPrice[symbol].multiplierUp;
        }else if(price < currentPrice * this.percentPrice[symbol].multiplierDown) {
            price = currentPrice * this.percentPrice[symbol].multiplierDown;
        }
        const pricePrecision = this.getPriceWithPrecision(price, this.ticks[symbol]);
        const quantityPrecision = this.getPriceWithPrecision(quantity, this.stepSizes[symbol]);
        const result = (await this.prepareRequest('/api/v3/order', 'POST', true, {
            type: 'LIMIT',
            symbol,
            timeInForce: 'GTC',
            newOrderRespType: 'FULL',
            side: 'SELL',
            price: pricePrecision,
            quantity: quantityPrecision
        }));
        console.warn(result);
        return result;
    }

    async getSymbols(market: string): Promise<string[]> {
        return (await this.getExchangeInfo()).symbols.filter((item: any) => item.status === 'TRADING' && item.quoteAsset === market).map((item: any) => item.symbol);
    }

    async getAccountInformation(): Promise<AccountInformationModel> {
        const resp = (await this.prepareRequest('/api/v3/account', 'GET', true));
        return AccountInformationConverter.fromBinanceResponse(resp);
    }

    async getActualBalance(symbolMarket: string): Promise<number> {
        const accountInfo = await this.getAccountInformation();
        const prices = await this.getPrices(symbolMarket);
        let balance = 0;
        for (const elem of accountInfo.balances) {
            const assetName = elem.asset + symbolMarket;
            console.log(assetName, prices[assetName], elem);
            if(elem.asset === symbolMarket) {
                balance += elem.free;
                balance += elem.locked;
            }else {
                balance += (prices[assetName] ?? 0) * elem.free;
                balance += (prices[assetName] ?? 0) * elem.locked;
            }
        }
        return balance;
    }
}

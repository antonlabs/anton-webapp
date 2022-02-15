import {BollingerBandsOutput} from "./indicator-results";
import {KlineModel} from "./kline.model";

enum Signal {
    BUY,
    SELL,
    FLAT
}

const signalToString = (val: Signal): 'BUY' | 'SELL' | 'FLAT' => {
    switch (val) {
        case Signal.BUY:
            return 'BUY';
        case Signal.SELL:
            return 'SELL';
        case Signal.FLAT:
            return 'FLAT';
    }
}

const stringToSignal = (val: 'BUY' | 'SELL' | 'FLAT'): Signal => {
    switch (val) {
        case 'BUY':
            return Signal.BUY;
        case 'SELL':
            return Signal.SELL;
        case 'FLAT':
            return Signal.FLAT;
    }
}

enum Sentiment {
    BULL,
    BEAR,
    FLAT
}

const sentimentToString = (val: Sentiment): 'BULL' | 'BEAR' | 'FLAT' => {
    switch (val) {
        case Sentiment.BULL:
            return 'BULL';
        case Sentiment.BEAR:
            return 'BEAR';
        case Sentiment.FLAT:
            return 'FLAT';
    }
}

const stringToSentiment = (val: 'BULL' | 'BEAR' | 'FLAT'): Sentiment => {
    switch (val) {
        case 'BULL':
            return Sentiment.BULL;
        case 'BEAR':
            return Sentiment.BEAR;
        case 'FLAT':
            return Sentiment.FLAT;
    }
}




export interface ScorePayload {
    bb: BollingerBandsOutput;
    price: number;
    rsi: number;
    volatility: number;
    volume: number;
    valid: boolean;
    signal: 'BUY' | 'SELL' | 'FLAT';
    sentiment: 'BULL' | 'BEAR' | 'FLAT';
}

export interface ScorePayloadDynamo {
    bb: number[];
    price: number;
    rsi: number;
    volatility: number;
    volume: number;
    valid: boolean;
    signal: Signal;
    sentiment: Sentiment;
}

export class ScorePayloadConverter {
    static toDynamoModel(model: ScorePayload): ScorePayloadDynamo {
        return {
            bb: [model.bb.upper, model.bb.middle, model.bb.lower],
            price: model.price,
            rsi: model.rsi,
            volatility: model.volatility,
            volume: model.volume,
            valid: model.valid,
            signal: stringToSignal(model.signal),
            sentiment: stringToSentiment(model.sentiment)
        }
    }

    static fromDynamoModel(model: ScorePayloadDynamo): ScorePayload {
        return {
            bb: {upper: model.bb[0], middle: model.bb[1], lower: model.bb[2]},
            price: model.price,
            rsi: model.rsi,
            volatility: model.volatility,
            volume: model.volume,
            valid: model.valid,
            signal: signalToString(model.signal),
            sentiment: sentimentToString(model.sentiment)
        }
    }
}

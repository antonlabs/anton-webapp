export interface MACDOutput {
    MACD?: number;
    signal?: number;
    histogram?: number;
}

export interface BollingerBandsOutput {
    middle: number;
    upper: number;
    lower: number;
}

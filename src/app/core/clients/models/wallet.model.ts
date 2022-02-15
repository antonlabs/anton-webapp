import {OrderModel} from "./order.model";

export enum WalletType {
    HUOBI,
    BINANCE
}

export interface Wallet {
    name: string;
    units: number;
    earnings: number;
    totalEarnings: number;
    type: WalletType;
    accessKey: string;
    secretKey: string;
    euroPerUnits: number;
    blacklist: string[];
    sellAll: boolean;
    lastErrorNotify?: number;
    ownerChatId: number;
}

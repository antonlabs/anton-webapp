import {Model} from "./model";
import {AssetBalanceModel} from "./asset-balance.model";


export interface AccountInformationModel extends Model {
    makerCommission: number;
    takerCommission: number;
    buyerCommission: number;
    sellerCommission: number;
    canTrade: boolean;
    canWithdraw: boolean;
    canDeposit: boolean;
    updateTime: number;
    accountType: string;
    balances: AssetBalanceModel[];
}
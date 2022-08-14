/**
 * Represents a single account data
 */
import { Balance } from "./Balance";

export interface AccountData {
    makerCommission: number;
    takerCommission: number;
    buyerCommission: number;
    sellerCommission: number;
    canTrade: boolean;
    canWithdraw: boolean;
    canDeposit: boolean;
    balances: Balance[];
}

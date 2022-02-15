import {AccountInformationModel} from "../models/account-information.model";


export class AccountInformationConverter {

    static fromBinanceResponse(data: any): AccountInformationModel {
        return {
            makerCommission: data.makerCommission,
            takerCommission: data.takerCommission,
            buyerCommission: data.buyerCommission,
            sellerCommission: data.sellerCommission,
            canTrade: data.canTrade,
            canWithdraw: data.canWithdraw,
            canDeposit: data.canDeposit,
            updateTime: data.updateTime,
            accountType: data.accountType,
            balances: data.balances.map((balance: any) => {
                return {
                    asset: balance.asset,
                    free: parseFloat(balance.free ?? '0'),
                    locked: parseFloat(balance.locked ?? '0')
                }
            })
        }
    }
}

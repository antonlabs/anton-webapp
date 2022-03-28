import {WalletDto} from "../dto/wallet.dto";
import {WalletModel} from "../models/wallet.model";
import {WalletType} from "../enums/wallet-type.enum";

export class WalletConverter {

  static toModel(dto: WalletDto): WalletModel {
    return {
      name: dto.name,
      symbolMarket: dto.symbolMarket,
      budget: dto.budget,
      alias: dto.alias,
      earnings: dto.earnings,
      maxOrderValue: dto.maxOrderValue,
      type: dto.type,
      sellStrategyMode: dto.sellStrategyMode,
      accessKey: dto.accessKey,
      secretKey: dto.secretKey,
      balances: [],
      blacklist: dto.blacklist
    }
  }

  static toDto(model: WalletModel): WalletDto {
    return {
      name: model.name,
      symbolMarket: model.symbolMarket ?? 'BUSD',
      alias: 'my-wallet',
      earnings: model.earnings,
      sellStrategyMode: 'STANDARD',
      maxOrderValue: model.maxOrderValue,
      type: WalletType.BINANCE,
      accessKey: model.accessKey ?? '',
      secretKey: model.secretKey ?? '',
      budget: model.budget,
      blacklist: model.blacklist
    }
  }

}

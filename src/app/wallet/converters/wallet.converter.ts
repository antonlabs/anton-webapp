import {WalletDto} from "../dto/wallet.dto";
import {WalletModel} from "../models/wallet.model";
import {WalletType} from "../enums/wallet-type.enum";

export class WalletConverter {

  static toModel(dto: WalletDto) {
    return {
      name: dto.name,
      symbolMarket: dto.symbolMarket,
      units: dto.units,
      earnings: dto.earnings,
      totalEarnings: dto.totalEarnings,
      type: dto.type,
      accessKey: dto.accessKey,
      secretKey: dto.secretKey,
      valuePerUnits: dto.valuePerUnits,
      blacklist: dto.blacklist
    }
  }

  static toDto(model: WalletModel) {
    return {
      name: model.name,
      symbolMarket: model.symbolMarket,
      units: model.units,
      earnings: model.earnings,
      totalEarnings: model.totalEarnings,
      type: WalletType.BINANCE,
      accessKey: model.accessKey ?? '',
      secretKey: model.secretKey ?? '',
      valuePerUnits: model.valuePerUnits,
      blacklist: model.blacklist
    }
  }

}

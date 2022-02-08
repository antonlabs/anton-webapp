import {WalletType} from "../enums/wallet-type.enum";

export interface WalletModel {
  name: string;
  symbolMarket: string;
  units: number;
  earnings?: number;
  totalEarnings?: number;
  type: WalletType;
  accessKey?: string;
  secretKey?: string;
  valuePerUnits?: number;
  blacklist?: string[];
}

import {WalletType} from "../enums/wallet-type.enum";

export interface WalletDto {
  name: string;
  symbolMarket?: string;
  alias?: string;
  earnings?: number;
  budget: number;
  maxOrderValue: number;
  type?: WalletType;
  accessKey?: string;
  secretKey?: string;
  valuePerUnits?: number;
  blacklist?: string[];
}

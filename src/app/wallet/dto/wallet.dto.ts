import {WalletType} from "../enums/wallet-type.enum";

export interface WalletDto {
  name: string;
  symbolMarket?: string;
  units?: number;
  alias?: string;
  earnings?: number;
  totalEarnings?: number;
  type?: WalletType;
  accessKey?: string;
  secretKey?: string;
  valuePerUnits?: number;
  blacklist?: string[];
}

import {WalletType} from "../enums/wallet-type.enum";
import {Model} from "../../core/clients/models/model";
import {EarningModel} from "./earning.model";

export enum StrategyStateType {
  RUNNING = 'RUNNING',
  DEPLOYING = 'DEPLOYING',
  BNB_FEE_MISSING = 'BNB_FEE_MISSING',
  KEYS_NOT_VALID = 'KEYS_NOT_VALID',
  KEY_PERMISSION = 'KEY_PERMISSION',
  BNB_LOW_BALANCE = 'BNB_LOW_BALANCE',
  DEPLOY_FAILED = 'DEPLOY_FAILED',
  STOPPED = 'STOPPED',
  DEPLOYED = 'DEPLOYED'
}


export interface StrategyAssociationModel extends Model {
  id: string;
  name: string;
  installationId: string;
  description: string;
  state: StrategyStateType;
}


export interface BalanceModel {
  date: Date;
  balance: number;
}


export interface WalletModel {
  name: string;
  symbolMarket?: string;
  alias?: string;
  earnings?: number;
  earningsHistory?: EarningModel[];
  totalEarnings?: number;
  type?: WalletType;
  strategy?: StrategyAssociationModel;
  accessKey?: string;
  autoReinvest?: boolean;
  secretKey?: string;
  budget: number;
  balances: BalanceModel[];
  maxOrderValue: number;
  blacklist?: string[];
}

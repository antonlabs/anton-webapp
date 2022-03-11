import {WalletType} from "../enums/wallet-type.enum";
import {Model} from "../../core/clients/models/model";

export enum StrategyStateType {
  RUNNING = 'RUNNING',
  DEPLOYING = 'DEPLOYING',
  DEPLOY_FAILED = 'DEPLOY_FAILED',
  STOPPED = 'STOPPED',
  DEPLOYED = 'DEPLOYED',
}


export interface StrategyAssociationModel extends Model {
  id: string;
  name: string;
  installationId: string;
  state: StrategyStateType;
}


export interface WalletModel {
  name: string;
  symbolMarket?: string;
  alias?: string;
  earnings?: number;
  totalEarnings?: number;
  type?: WalletType;
  strategy?: StrategyAssociationModel;
  accessKey?: string;
  autoReinvest?: boolean;
  secretKey?: string;
  budget: number;
  maxOrderValue: number;
  blacklist?: string[];
}

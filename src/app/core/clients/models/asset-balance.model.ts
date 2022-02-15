import {Model} from "./model";


export interface AssetBalanceModel extends Model {
    asset: string;
    free: number;
    locked: number;
}
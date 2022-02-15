import {Model} from "./model";

export interface KlineModel extends Model {
    openTime: number;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
}

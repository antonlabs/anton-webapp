import { SymbolStatus } from "../../enums/SymbolStatus";
import { OrderType } from "../../enums/OrderType";
import { PriceFilter } from "../filter/PriceFilter";
import { FilterType } from "../../enums/FilterType";
import { LotSizeFilter } from "../filter/LotSizeFilter";
import { MinimumNotionalFilter } from "../filter/MinimumNotionalFilter";
import { MaxOrdersFilter } from "../filter/MaxOrdersFilter";
import { MaxAlgoOrdersFilter } from "../filter/MaxAlgoOrdersFilter";
import { SymbolFilter } from "../filter/abstraction/SymbolFilter";

/**
 * Represents a single symbol.
 */
export class Symbol {
    private _name: string;
    private _status: SymbolStatus;
    private _baseAsset: string;
    private _baseAssetPrecision: number;
    private _quoteAsset: string;
    private _quoteAssetPrecision: number;
    private _orderTypes: OrderType[];
    private _icebergAllowed: boolean;
    private _filters: SymbolFilter[];

    constructor(json: any) {
        this._name = json.symbol;
        this._status = SymbolStatus[json.status as keyof typeof SymbolStatus];
        this._baseAsset = json.baseAsset;
        this._baseAssetPrecision = json.baseAssetPrecision;
        this._quoteAsset = json.quoteAsset;
        this._quoteAssetPrecision = json.quotePrecision;
        this._icebergAllowed = json.icebergAllowed;

        this._orderTypes = [];
        for (const orderType of json.orderTypes) {
            this._orderTypes.push(
                OrderType[orderType as keyof typeof OrderType]
            );
        }

        this._filters = [];
        for (const jsonFilter of json.filters) {
            let filter: SymbolFilter;
            switch (
                FilterType[jsonFilter.filterType as keyof typeof FilterType]
            ) {
                case FilterType.PRICE_FILTER: {
                    filter = new PriceFilter(jsonFilter);
                    break;
                }
                case FilterType.LOT_SIZE: {
                    filter = new LotSizeFilter(jsonFilter);
                    break;
                }
                case FilterType.MIN_NOTIONAL: {
                    filter = new MinimumNotionalFilter(jsonFilter);
                    break;
                }
                case FilterType.MAX_NUM_ORDERS: {
                    filter = new MaxOrdersFilter(jsonFilter);
                    break;
                }
                case FilterType.MAX_ALGO_ORDERS: {
                    filter = new MaxAlgoOrdersFilter(jsonFilter);
                    break;
                }
            }
            this._filters.push(filter);
        }
    }

    get name(): string {
        return this._name;
    }

    set name(value: string) {
        this._name = value;
    }

    get status(): SymbolStatus {
        return this._status;
    }

    set status(value: SymbolStatus) {
        this._status = value;
    }

    get baseAsset(): string {
        return this._baseAsset;
    }

    set baseAsset(value: string) {
        this._baseAsset = value;
    }

    get baseAssetPrecision(): number {
        return this._baseAssetPrecision;
    }

    set baseAssetPrecision(value: number) {
        this._baseAssetPrecision = value;
    }

    get quoteAsset(): string {
        return this._quoteAsset;
    }

    set quoteAsset(value: string) {
        this._quoteAsset = value;
    }

    get quoteAssetPrecision(): number {
        return this._quoteAssetPrecision;
    }

    set quoteAssetPrecision(value: number) {
        this._quoteAssetPrecision = value;
    }

    get orderTypes(): OrderType[] {
        return this._orderTypes;
    }

    set orderTypes(value: OrderType[]) {
        this._orderTypes = value;
    }

    get icebergAllowed(): boolean {
        return this._icebergAllowed;
    }

    set icebergAllowed(value: boolean) {
        this._icebergAllowed = value;
    }

    get filters(): SymbolFilter[] {
        return this._filters;
    }

    set filters(value: SymbolFilter[]) {
        this._filters = value;
    }
}

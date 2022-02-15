import {TitleDto} from "../dto/title.dto";
import {TitleModel} from "../models/title.model";


export class PricesConverter {
    static pricesConverter(val: TitleDto[], symbolMarket: string): TitleModel {
        const result: TitleModel = {};
        val.forEach(item => {
            if(item.symbol.endsWith(symbolMarket)) {
                result[item.symbol] = Number(item.price);
            }
        });
        return result;
    };
}
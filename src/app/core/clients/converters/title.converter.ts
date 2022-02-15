import {TitleModel} from "../models/title.model";
import {TitleDto} from "../dto/title.dto";
import {DynamoConverter} from "./dynamo-converter";
import {DocumentClient} from "aws-sdk/clients/dynamodb";

export class TitleConverter implements DynamoConverter{

    toDto(model: TitleModel) {}

    toModel(dto: TitleDto) {
        const result: {[key: string]: number} = {};
        // Object.keys(dto).forEach(key => result[key] = Number(dto[key]))
        return result;
    }

    fromDynamoModel(val: DocumentClient.AttributeMap): TitleModel {
        const result: {[key: string]: number} = {};
        result[val.pk] = val.price;
        return result;
    }

    toDynamoModel(val: TitleModel): DocumentClient.PutItemInputAttributeMap {
        return {};
    }

}

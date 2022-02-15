import {Model} from "../models/model";
import {DocumentClient} from "aws-sdk/clients/dynamodb";

export interface DynamoConverter {
  toDynamoModel(val: Model): DocumentClient.PutItemInputAttributeMap;

  fromDynamoModel(val: DocumentClient.AttributeMap): Model;
}

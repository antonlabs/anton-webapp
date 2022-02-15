import {Key} from 'aws-sdk/clients/dynamodb';
import {DocumentClient} from 'aws-sdk/lib/dynamodb/document_client';
import {Model} from "./model";
import {DynamoDB} from "aws-sdk";
import {Converter} from "../converters/converter";
import {DynamoConverter} from "../converters/dynamo-converter";

export class DynamoDbIterator<T extends Model> implements AsyncIterableIterator<T> {
  private queryInput: DocumentClient.QueryInput;
  private data: T[] | null = null;
  private paginationToken: Key | undefined;
  private dynamo: DynamoDB.DocumentClient;
  private converter: DynamoConverter;

  constructor(dynamo: DynamoDB.DocumentClient, converter: DynamoConverter, queryInput: DocumentClient.QueryInput) {
    this.converter = converter;
    this.dynamo = dynamo;
    this.queryInput = queryInput;
  }

  public async executeQuery(): Promise<void> {
    if (this.data && this.data.length === 0) {
      console.log(this.queryInput);
      const data = await this.dynamo.query(this.queryInput).promise();
      this.paginationToken = data.LastEvaluatedKey;
      const items = data.Items;
      if (items) {
        this.data = (items.map(this.converter.fromDynamoModel) as T[]);
      }
    }
  }

  public async next(): Promise<IteratorResult<T>> {
    if (this.data == null) {
      this.data = [];
      await this.executeQuery();
    }
    if (this.data && this.data.length > 0) {
      const toReturn = this.data.pop();
      if (toReturn) {
        return {done: false, value: toReturn};
      }
      return {done: true, value: null};
    } else if (this.paginationToken) {
      this.queryInput.ExclusiveStartKey = this.paginationToken;
      await this.executeQuery();
      if (this.data && this.data.length > 0) {
        const toReturn = this.data.pop();
        if (toReturn) {
          return {done: false, value: toReturn};
        }
        return {done: true, value: null};
      }
    }
    return {done: true, value: null};
  }

  [Symbol.asyncIterator]() {
    return this;
  }

  [Symbol.iterator]() {
    return this;
  }
}

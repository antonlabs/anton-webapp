import {DynamoDBClient, GetItemCommand} from "@aws-sdk/client-dynamodb";
import {AwsClient} from "aws4fetch";
import {AppState} from "../app-state";
import {environment} from "../../environments/environment";

const getLiteral = (str: string, obj: any): any => {
  return str.split('.').reduce((o, i) => (o ?? {[str]: undefined})[i], obj);
};

const tableName = environment.name + '-' + environment.userTable;

export const dynamoDbClient = new DynamoDBClient({
  region: 'eu-west-1',
  credentials: AppState.val.iamCredentials as any
});

export const apiG = () => {
  return new AwsClient({...{service: 'execute-api', region: 'eu-west-1'}, ...AppState.val.iamCredentials as any});
}

export const getUserItem = async <T>(sk: string): Promise<T | undefined> => {
  if(!AppState.val.identityId) return;

  return (await dynamoDbClient.send(new GetItemCommand({
    TableName: tableName,
    Key: {
      pk: {
        S: AppState.val.identityId
      },
      sk: {
        S: sk
      }
    }
  }))).Item as any;
}

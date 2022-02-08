import {DynamoDBClient, GetItemCommand, QueryCommand} from "@aws-sdk/client-dynamodb";
import {AwsClient} from "aws4fetch";
import {AppState} from "../app-state";
import {environment} from "../../environments/environment";

const getLiteral = (str: string, obj: any): any => {
  return str.split('.').reduce((o, i) => (o ?? {[str]: undefined})[i], obj);
};

const tableName = environment.name + '-' + environment.userTable;

export const dynamoDbClient = () => new DynamoDBClient({
  region: 'eu-west-1',
  credentials: AppState.val.iamCredentials as any
});

export const apiG = (
  input: string, init?: (RequestInit & {
    aws?: {
      accessKeyId?: string | undefined;
      secretAccessKey?: string | undefined;
      sessionToken?: string | undefined;
      service?: string | undefined;
      region?: string | undefined;
      cache?: Map<string, ArrayBuffer> | undefined;
      datetime?: string | undefined;
      signQuery?: boolean | undefined;
      appendSessionToken?: boolean | undefined;
      allHeaders?: boolean | undefined;
      singleEncode?: boolean | undefined;
    } | undefined;
  }) | null | undefined
) => {
  init = init ?? {headers: new Headers()};
  if(!init.headers)
    init.headers = new Headers();

  (init.headers as Headers).set('Content-Type', 'application/json');

  return new AwsClient({...{service: 'execute-api', region: 'eu-west-1'}, ...AppState.val.iamCredentials as any}).fetch(environment.beUrl + '/' + input, init);
}

export const getUserItem = async <T>(sk: string): Promise<T | undefined> => {
  if(!AppState.val.identityId) return;

  return (await dynamoDbClient().send(new GetItemCommand({
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

export const getUserListItem = async <T>(param: string): Promise<T[] | undefined> => {
  if(!AppState.val.identityId) return;

  return (await dynamoDbClient().send(new QueryCommand({
    TableName: tableName,
    KeyConditionExpression: '#pk = :pk AND begins_with(#sk, :sk)',
    ExpressionAttributeNames: {
      '#sk': 'sk',
      '#pk': 'pk'
    },
    ExpressionAttributeValues: {
      ':sk': {
        'S': param
      },
      ':pk': {
        'S': AppState.val.identityId
      }
    }
  }))).Items as any;
}

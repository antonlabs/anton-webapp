import {DynamoDBClient} from "@aws-sdk/client-dynamodb";
import {AwsClient} from "aws4fetch";
import {environment} from "../../environments/environment";
import {WalletModel} from "../wallet/models/wallet.model";
import {DynamoDBDocument} from "@aws-sdk/lib-dynamodb";
import {UserDto} from "./dto/user.dto";
import jwtDecode from "jwt-decode";
import { states } from "../states/app-state";

export const getLiteral = (str: string, obj: any): any => {
  return str.split('.').reduce((o, i) => (o ?? {[str]: undefined})[i], obj);
};

const tableName = environment.name + '-' + environment.userTable;

export const dynamoDbClient = () => new DynamoDBClient({
  region: environment.region,
  credentials: states.iamCredentials.val
});

export const documentClient = (): DynamoDBDocument => DynamoDBDocument.from(dynamoDbClient())

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
  console.log('init aws client');
  return new AwsClient({
    ...{service: 'execute-api', region: 'eu-west-1'},
    ...states.iamCredentials.val as any}
  ).fetch(environment.beUrl + '/' + input, init)
    .then((r) => r.status > 400 ? Promise.reject(r) : Promise.resolve(r))
    .catch((e) => {
      return e?.body.getReader().read().then((e2: any) => {
        return Promise.reject(new TextDecoder().decode(e2.value));
      });
    });
}

export const getUserItem = async <T>(sk: string): Promise<T | undefined> => {
  if(!states.user.val.identityId) return;

  return (await documentClient().get({
    TableName: tableName,
    Key: {
      pk: states.user.val.identityId,
      sk
    }
  })).Item as T;
}

export const refreshWallets = async <T>(): Promise<void> => {
  const wallets: WalletModel[] | undefined = await getUserListItem<WalletModel>('WALLET');

  states.wallets.set({
    wallets: wallets ?? []
  });

  for(const wallet of wallets ?? []) {
    if(wallet.name === states.currentWallet.val.name) {
      states.currentWallet.set(wallet);
    }
  }

  if(!states.currentWallet.val.name && (wallets ?? []).length > 0) {
    states.currentWallet.set(wallets![0])
  }
}

export const getUserListItem = async <T>(param: string): Promise<T[] | undefined> => {
  if(!states.user.val.identityId) return;
  return (await documentClient().query({
    TableName: tableName,
    KeyConditionExpression: '#pk = :pk AND begins_with(#sk, :sk)',
    ExpressionAttributeNames: {
      '#sk': 'sk',
      '#pk': 'pk'
    },
    ExpressionAttributeValues: {
      ':sk': param,
      ':pk': states.user.val.identityId
    }
  })).Items as T[];
}


export const jwtToUserDto = (jwt: string): UserDto => {
  const data = (jwtDecode(jwt) as any);
  return {
    email: data.email,
    avatar: data.picture,
    identityId: data.identities[0].userId,
    name: data.given_name,
    surname: data.family_name
  }
}

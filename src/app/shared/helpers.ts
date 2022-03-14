import {DynamoDBClient} from "@aws-sdk/client-dynamodb";
import {AwsClient} from "aws4fetch";
import {environment} from "../../environments/environment";
import {WalletModel} from "../wallet/models/wallet.model";
import {DynamoDBDocument} from "@aws-sdk/lib-dynamodb";
import {UserDto} from "./dto/user.dto";
import jwtDecode from "jwt-decode";
import {rack} from "../states/app-state";
import {CognitoIdentityProviderClient} from "@aws-sdk/client-cognito-identity-provider";
import {CognitoIdentityClient} from "@aws-sdk/client-cognito-identity";
import {OcoOrderModel, OrderModel} from "../wallet/models/order.model";
import {OrderConverter} from "../core/clients/converters/order.converter";
import {TransactionModel} from "../core/clients/models/transaction.model";
import {TransactionConverter} from "../core/clients/converters/transaction.converter";

export const getLiteral = (str: string, obj: any): any => {
  return str.split('.').reduce((o, i) => (o ?? {[str]: undefined})[i], obj);
};

const tableName = environment.name + '-' + environment.userTable;
const transactionTableName = environment.name + '-' + environment.transactionsTable;

export const dynamoDbClient = () => new DynamoDBClient({
  region: environment.region,
  credentials: rack.states.iamCredentials.val
});

export const documentClient = (): DynamoDBDocument => DynamoDBDocument.from(dynamoDbClient(), {
  marshallOptions: {removeUndefinedValues: true}
})


export const cognito = new CognitoIdentityProviderClient({region: environment.region});
export const cognitoIdentity = new CognitoIdentityClient({region: environment.region});

export const apiG = async (
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

  await rack.states.iamCredentials.refreshState();
  (init.headers as Headers).set('Content-Type', 'application/json');
  return new AwsClient({
    ...{service: 'execute-api', region: 'eu-west-1'},
    ...rack.states.iamCredentials.val as any
  }).fetch(environment.beUrl + '/' + input, init)
    .then((r) => r.status > 400 ? Promise.reject(r) : Promise.resolve(r))
    .then((r: any) => {
      return r.body.getReader().read().then((data: any) => {
        return Promise.resolve(JSON.parse(new TextDecoder().decode(data.value)));
      });
    })
    .catch((e) => {
      return e?.body.getReader().read().then((e2: any) => {
        return Promise.reject(new TextDecoder().decode(e2.value));
      });
    });
}

export const getUserItem = async <T>(sk: string): Promise<T | undefined> => {
  if(!rack.states.user.val.identityId) return;

  return (await documentClient().get({
    TableName: tableName,
    Key: {
      pk: rack.states.user.val.identityId,
      sk
    }
  })).Item as T;
}

export const refreshWallets = async <T>(): Promise<void> => {
  const wallets: WalletModel[] | undefined = await getUserListItem<WalletModel>('WALLET');

  rack.states.wallets.set({
    wallets: wallets ?? []
  });

  for(const wallet of (wallets ?? [])) {
    if(wallet.name === rack.states.currentWallet.val.name) {
      rack.states.currentWallet.set(wallet);
    }
  }

  if(!rack.states.currentWallet.val.name && (wallets ?? []).length > 0) {
    rack.states.currentWallet.set(wallets![0])
  }
}

export const getUserListItem = async <T>(param: string): Promise<T[] | undefined> => {
  if(!rack.states.user.val.identityId) return;
  return (await documentClient().query({
    TableName: tableName,
    KeyConditionExpression: '#pk = :pk AND begins_with(#sk, :sk)',
    ExpressionAttributeNames: {
      '#sk': 'sk',
      '#pk': 'pk'
    },
    ExpressionAttributeValues: {
      ':sk': param,
      ':pk': rack.states.user.val.identityId
    }
  })).Items as T[];
}

export interface GetTransactionOutput<T> {
    data: T[],
    pagination: {
      [key: string]: {[key: string] : any} | undefined
    }
}

export const getOrders = async (transactionId: string): Promise<OcoOrderModel[]> => {
  console.log( 'HISTORY#'+transactionId);
  const orders: OrderModel[] = ((await documentClient().query({
    TableName: transactionTableName,
    KeyConditionExpression: '#pk = :pk AND begins_with(#sk, :sk)',
    ExpressionAttributeNames: {
      '#sk': 'sk',
      '#pk': 'pk'
    },
    ExpressionAttributeValues: {
      ':sk': 'HISTORY#'+transactionId,
      ':pk': rack.states.user.val.identityId
    }
  })).Items ?? []).map(item => OrderConverter.fromDynamoModel(item));

  const transactionsMap: {[key: string]: OrderModel[]} = {};
  const ocoOrders: OcoOrderModel[] = [];
  for(const order of orders) {
    if(order.orderListId === -1) {
      ocoOrders.push({
        orders: [order],
        oco: false,
        transactionId,
        symbol: order.symbol,
        orderListId: -1
      });
    }else {
      if(transactionsMap[order.orderListId.toString()] === undefined) {
        transactionsMap[order.orderListId.toString()] = [JSON.parse(JSON.stringify(order))];
      }else {
        transactionsMap[order.orderListId.toString()].push(JSON.parse(JSON.stringify(order)));
      }
    }
  }
  for(const key of Object.keys(transactionsMap)) {
    ocoOrders.push({
      orders: transactionsMap[key],
      oco: true,
      transactionId,
      symbol: transactionsMap[key][0].symbol,
      orderListId: parseFloat(key)
    })
  }
  return ocoOrders;
}

export const getTransactions = async (type?: 'OPEN' | 'CLOSE'): Promise<TransactionModel[]> => {
  if(!rack.states.user.val.identityId) return [];
  return ((await documentClient().query({
    TableName: transactionTableName,
    KeyConditionExpression: '#pk = :pk AND begins_with(#sk, :sk)',
    ExpressionAttributeNames: {
      '#sk': 'sk',
      '#pk': 'pk'
    },
    ExpressionAttributeValues: {
      ':sk': `TRANSACTION${type ? '#'+type : ''}`,
      ':pk': rack.states.user.val.identityId
    }
  })).Items ?? []).map(item => new TransactionConverter().fromDynamoModel(item));
}


export const getGlobalProperty = async <T>(param: string): Promise<T[] | undefined> => {
  if(!rack.states.user.val.identityId) return;
  return (await documentClient().query({
    TableName: tableName,
    KeyConditionExpression: '#pk = :pk AND begins_with(#sk, :sk)',
    ExpressionAttributeNames: {
      '#sk': 'sk',
      '#pk': 'pk'
    },
    ExpressionAttributeValues: {
      ':sk': param,
      ':pk': 'GLOBAL'
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

export const orderTypes: {[key: string] : string} = {
  'STOP_LOSS_LIMIT': $localize`Stop loss limit`,
  'LIMIT_MAKER': $localize`Limit maker`,
  'LIMIT': $localize`Limit`,
  'MARKET': $localize`Market`,
}


export const orderStatus: {[key: string] : string} = {
  'NEW': $localize`Pending`,
  'EXPIRED': $localize`Canceled`,
  'CANCELED': $localize`Canceled`,
  'FILLED': $localize`Completed`,
}

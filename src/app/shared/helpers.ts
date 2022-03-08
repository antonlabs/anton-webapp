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

export const getTransactions = async (types: ('SELL' | 'BUY' | 'HISTORY')[], symbol?: string, pagination: {[key: string]: any} = {}): Promise<GetTransactionOutput<OcoOrderModel>| undefined> => {
  if(!rack.states.user.val.identityId) return;
  const dynamoResponse: GetTransactionOutput<OrderModel> = {
    data: [],
    pagination: {}
  };
  await Promise.all(
    types.map(type => documentClient().query({
        TableName: transactionTableName,
        KeyConditionExpression: '#pk = :pk AND begins_with(#sk, :sk)',
        ExclusiveStartKey: pagination[type] ? {
          S: pagination[type]
        } : undefined,
        ExpressionAttributeNames: {
          '#sk': 'sk',
          '#pk': 'pk'
        },
        ExpressionAttributeValues: {
          ':sk': type + '#' + (symbol ?? ''),
          ':pk': rack.states.user.val.identityId
        },
        Limit: 100
    }).then(response => {
      dynamoResponse.data.push(...(response.Items as OrderModel[]).filter(item => dynamoResponse.data.findIndex(data => data.orderId === item.orderId) === -1));
      dynamoResponse.pagination[type] = response.LastEvaluatedKey;
    }))
  );
  const transactionsMap: {[key: string]: OrderModel[]} = {};
  const ocoOrders: OcoOrderModel[] = [];
  const transactions = dynamoResponse.data;
  for(const transaction of transactions) {
    if(transaction.orderListId === -1) {
      ocoOrders.push({
        orders: [transaction],
        oco: false,
        symbol: transaction.symbol,
        orderListId: -1
      });
    }else {
      if(transactionsMap[transaction.orderListId.toString()] === undefined) {
        transactionsMap[transaction.orderListId.toString()] = [JSON.parse(JSON.stringify(transaction))];
      }else {
        transactionsMap[transaction.orderListId.toString()].push(JSON.parse(JSON.stringify(transaction)));
      }
    }
  }
  for(const key of Object.keys(transactionsMap)) {
    ocoOrders.push({
      orders: transactionsMap[key],
      oco: true,
      symbol: transactionsMap[key][0].symbol,
      orderListId: parseFloat(key)
    })
  }

  return {
    data: ocoOrders,
    pagination: dynamoResponse.pagination
  };
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

import {DynamoDBClient} from "@aws-sdk/client-dynamodb";
import {AwsClient} from "aws4fetch";
import {environment} from "../../environments/environment";
import {BalanceModel, WalletModel} from "../wallet/models/wallet.model";
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
import {EarningModel} from "../wallet/models/earning.model";
import {NativeAttributeValue} from "@aws-sdk/util-dynamodb";

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

export const refreshEarnings = async <T>(): Promise<void> => {
  const earnings: EarningModel[] | undefined = await getUserListItem<EarningModel>('EARNINGS');

  rack.states.currentWallet.set({
    earningsHistory: earnings
  });
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

export const refreshBalances = async <T>(): Promise<void> => {
  const balances: BalanceModel[] = await getWalletBalances();
  const lastBalance = await getAntonBalance(rack.states.currentWallet.val);
  balances.push({
    balance: lastBalance,
    date: new Date()
  });
  rack.states.currentWallet.set({
    balances
  });
}

export const getAntonBalance = async (wallet: WalletModel): Promise<number> => {
  return (await apiG('wallet/balance/'+wallet.name+'/wallet_balance', {
    method: 'GET'
  }));
}


export const getWalletBalances = async (): Promise<BalanceModel[]> => {
  if(!rack.states.user.val.identityId) return [];
  return ((await documentClient().query({
    TableName: tableName,
    KeyConditionExpression: '#pk = :pk AND begins_with(#sk, :sk)',
    ExpressionAttributeNames: {
      '#sk': 'sk',
      '#pk': 'pk'
    },
    ExpressionAttributeValues: {
      ':sk': 'BALANCE#'+rack.states.currentWallet.val.name,
      ':pk': rack.states.user.val.identityId
    }
  })).Items ?? []).map(o => ({
    balance: o['balance'],
    date: o['sk'].split('#').slice(-1)[0]
  }))
}


export interface GetTransactionOutput<T> {
    data: T[],
    pagination: {
      [key: string]: {[key: string] : any} | undefined
    }
}

export const getOrders = async (transactionId: string): Promise<OcoOrderModel[]> => {
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

export type PaginationToken = { [key: string]: NativeAttributeValue};

export const getTransactions = async (type?: 'OPEN' | 'CLOSE', paginationToken?: PaginationToken): Promise<{data: TransactionModel[], lastKey: PaginationToken | undefined}> => {
  if(!rack.states.user.val.identityId) return {
    lastKey: undefined,
    data: [],
  };
  const response = (await documentClient().query({
    TableName: transactionTableName,
    KeyConditionExpression: '#pk = :pk AND begins_with(#sk, :sk)',
    IndexName: 'transaction-ordered-date-index',
    ScanIndexForward: false,
    ExpressionAttributeNames: {
      '#sk': 'alternativeSk',
      '#pk': 'pk'
    },
    ExclusiveStartKey: paginationToken,
    Limit: 20,
    ExpressionAttributeValues: {
      ':sk': `TRANSACTION${type ? '#'+type : ''}`,
      ':pk': rack.states.user.val.identityId
    }
  }));
  return {
    lastKey: response.LastEvaluatedKey,
    data: (response.Items ?? []).map(item => new TransactionConverter().fromDynamoModel(item))
  }
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
  'PARTIALLY_FILLED': $localize`Partially filled`,
  'FILLED': $localize`Completed`,
}

export const errorMessages: {[key: string]: string} = {
  KEYS_NOT_VALID: $localize`The key that you have selected are not valid, please insert a new one and retry`,
  KEY_PERMISSION: $localize`The keys are correct, but you have not enabled spot wallet trading, if you don't know how to enable, please watch this video and retry`,
  BNB_FEE_MISSING: $localize`Your fee payment method is not BNB, we recommend to enable it to maximize your earnings, do you want enable it?`
};

export const getErrorMessage = (message: string) => errorMessages[message] ?? $localize`Something went wrong, please retry later`;

const getPriceOrder = (order: OrderModel) => {
  if (parseFloat(order.price) === 0) {
    const result = parseFloat(order.cummulativeQuoteQty) / parseFloat(order.executedQty);
    return isNaN(result) ? parseFloat(order.fills[0].price) : result;
  }
  return parseFloat(order.price);
}

const getFilledQuantity = (order: OrderModel, market: string) => {
  let filledQuantity = parseFloat(order.origQty);
  (order.fills ?? []).forEach((transaction) => {
    if (transaction.commissionAsset === order.symbol.replace(market, '')) {
      filledQuantity -= parseFloat(transaction.commission);
    }
  });
  return filledQuantity;
}

export const getVolumeOrder = (order: OrderModel, market: string) => {
  const qty = getFilledQuantity(order, market);
  return getPriceOrder(order) * qty;
}


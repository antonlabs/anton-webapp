import {TransactionModel} from "../models/transaction.model";

export class TransactionConverter {

    toDynamoModel(identityId: string, symbol: string, history: boolean = false): any {
        const ttl = !history ? new Date() : undefined;
        ttl?.setMonth(ttl.getMonth() + 1);
        let sk = `${symbol}#${new Date().toISOString()}`
        if (history) {
            sk = `TRANSACTION#CLOSE#${sk}`;
        }else {
            sk = `TRANSACTION#OPEN#${sk}`;
        }
        const ttlString = history ? ttl?.toISOString() : undefined;
        return {
            pk: identityId,
            sk,
            ttlString
        }
    }

    fromDynamoModel(order: any): TransactionModel {
        return {
          time: new Date(order.sk.split('#')[3]),
          symbol: order.sk.split('#')[2],
          id: order.sk.split('#').slice(2).join('#'),
          closed: order.sk.split('#')[1] === 'CLOSE'
        };
    }

}

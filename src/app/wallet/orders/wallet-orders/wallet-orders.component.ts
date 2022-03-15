import { Component, OnInit } from '@angular/core';
import {OcoOrderModel, OrderModel} from "../../models/order.model";
import {WalletService} from "../../../shared/wallet.service";
import {AntiMemLeak} from "../../../shared/anti-mem-leak";
import {ActivatedRoute} from "@angular/router";
import {orderTypes} from "../../../shared/helpers";
import {rack} from "../../../states/app-state";
import {TransactionModel} from "../../../core/clients/models/transaction.model";

@Component({
  selector: 'app-wallet-orders',
  templateUrl: './wallet-orders.component.html',
  styleUrls: ['./wallet-orders.component.scss']
})
export class WalletOrdersComponent extends AntiMemLeak implements OnInit {

  transactions: {[key: string]: TransactionModel} | undefined;
  currentTransaction: TransactionModel | undefined;
  types = orderTypes;
  values = Object.values;

  constructor(
    private walletService: WalletService,
    private activatedRoute: ActivatedRoute
  ) {
    super();
  }

  ngOnInit(): void {
    this.sub.add(
      rack.states.currentWallet.obs.subscribe((wallet) => {
        if(wallet.transactions) {
          this.transactions = wallet.transactions;
          this.refreshCurrentTransaction();
        }
      })
    );
    rack.states.currentWallet.refreshTransactions();
    this.sub.add(this.activatedRoute.queryParams.subscribe((_: any) => {
      this.refreshCurrentTransaction();
    }));
  }

  sortTransaction(transactions: TransactionModel[]) {
    return transactions.sort((b, a) => a.time.getTime() - b.time.getTime());
  }

  refreshCurrentTransaction() {
    const transaction = this.activatedRoute.snapshot.queryParams['transaction'];
    if (transaction && this.transactions) {
      this.currentTransaction = this.transactions[transaction];
      if(this.currentTransaction) {
        rack.states.currentWallet.getTransactionOrders(transaction).then(
          (orders) => this.currentTransaction!.orders = orders
        );
      }
    }
  }

  getTransactTime(transactionModel: TransactionModel): string {
    return new Date(transactionModel.time).toLocaleString();
  }

}

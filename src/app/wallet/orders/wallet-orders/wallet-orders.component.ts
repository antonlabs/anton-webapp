import { Component, OnInit } from '@angular/core';
import {OcoOrderModel, OrderModel} from "../../models/order.model";
import {WalletService} from "../../../shared/wallet.service";
import {AntiMemLeak} from "../../../shared/anti-mem-leak";
import {ActivatedRoute, Router} from "@angular/router";
import {orderTypes} from "../../../shared/helpers";
import {rack} from "../../../states/app-state";
import {TransactionModel} from "../../../core/clients/models/transaction.model";
import {FormControl} from "@angular/forms";

@Component({
  selector: 'app-wallet-orders',
  templateUrl: './wallet-orders.component.html',
  styleUrls: ['./wallet-orders.component.scss']
})
export class WalletOrdersComponent extends AntiMemLeak implements OnInit {

  transactions: {[key: string]: TransactionModel} | undefined;
  transactionsList: TransactionModel[] = [];
  currentTransaction: TransactionModel | undefined;
  types = orderTypes;
  values = Object.values;
  mode: 'OPEN' | 'CLOSE' = 'OPEN';
  proSwitch = new FormControl(false);

  constructor(
    private walletService: WalletService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    super();
  }

  ngOnInit(): void {
    this.sub.add(
      rack.states.currentWallet.obs.subscribe((wallet) => {
        if(wallet.transactions) {
          this.transactions = wallet.transactions;
          this.transactionsList = this.sortTransaction(Object.values(wallet.transactions));
          this.refreshCurrentTransaction();
        }
      })
    );
    this.sub.add(this.activatedRoute.queryParams.subscribe((queryParams: any) => {
      if(this.mode !== queryParams.mode) {
        if(queryParams.mode) {
          this.mode = queryParams.mode;
        }
        rack.states.currentWallet.refreshTransactions(this.mode);
      }
      if(queryParams.pro !== this.proSwitch.value) {
        this.proSwitch.setValue(queryParams.pro ?? false);
      }
      this.refreshCurrentTransaction();
    }));
    this.sub.add(
      this.proSwitch.valueChanges.subscribe(val => {
        this.router.navigate(['/orders'], {queryParams: {pro: val}, queryParamsHandling: 'merge'})
      })
    );
  }

  sortTransaction(transactions: TransactionModel[]) {
    return (transactions ?? []).sort((b, a) => new Date(a.time).getTime() - new Date(b.time).getTime());
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

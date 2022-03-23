import { Component, OnInit } from '@angular/core';
import {OcoOrderModel, OrderModel} from "../../models/order.model";
import {WalletService} from "../../../shared/wallet.service";
import {AntiMemLeak} from "../../../shared/anti-mem-leak";
import {ActivatedRoute, Router} from "@angular/router";
import {orderTypes, PaginationToken} from "../../../shared/helpers";
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
  proSwitch = new FormControl(rack.states.user.val.pro);
  lastPaginationToken: PaginationToken | undefined;

  constructor(
    private walletService: WalletService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    super();
  }

  ngOnInit(): void {
    console.log(document.getElementById('list'));
    document.getElementById('list')?.addEventListener('scroll', (event) => {
      const element: any = event.target;
      const isAtBottom = ( element.scrollHeight - element.scrollTop <= element.clientHeight + 50 );
      if(isAtBottom && this.lastPaginationToken) {
        rack.states.currentWallet.refreshTransactions(this.mode, this.lastPaginationToken).then((res) => {
          this.lastPaginationToken = res.lastKey;
        });
      }
    })
    this.sub.add(
      rack.states.currentWallet.obs.subscribe((wallet) => {
        if(wallet.transactions) {
          this.transactions = wallet.transactions;
          this.transactionsList = this.sortTransaction(Object.values(wallet.transactions));
          console.log(this.transactionsList);
          this.refreshCurrentTransaction();
        }
      })
    );
    this.sub.add(this.activatedRoute.queryParams.subscribe((queryParams: any) => {
      if(this.mode !== queryParams.mode) {
        if(queryParams.mode) {
          this.mode = queryParams.mode;
        }
        this.lastPaginationToken = undefined;
        rack.states.currentWallet.set({
          transactions: {}
        });
        rack.states.currentWallet.refreshTransactions(this.mode).then((res) => {
          this.lastPaginationToken = res.lastKey;
        });
      }
      this.refreshCurrentTransaction();
    }));
    this.sub.add(
      rack.states.user.obs.subscribe(user => {
        console.log(user.pro);
        if(user.pro !== this.proSwitch.value) {
          this.proSwitch.setValue(user.pro ?? false);
        }
      })
    );
  }

  togglePro() {
    rack.states.user.set({
      pro: this.proSwitch.value
    });
    rack.states.user.store();
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

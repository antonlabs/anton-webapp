import { Component, OnInit } from '@angular/core';
import {rack} from "../../states/app-state";
import {AntiMemLeak} from "../../shared/anti-mem-leak";
import {ActivatedRoute} from "@angular/router";
import {FormControl} from "@angular/forms";
import {TransactionModel} from "../../core/clients/models/transaction.model";
import {getTransaction} from "../../shared/helpers";

@Component({
  selector: 'app-transaction-details-modal',
  templateUrl: './transaction-details-modal.component.html',
  styleUrls: ['./transaction-details-modal.component.scss']
})
export class TransactionDetailsModalComponent extends AntiMemLeak implements OnInit {
  proSwitch = new FormControl(rack.states.user.val.pro);
  currentTransaction: TransactionModel | undefined;

  constructor(
    private activatedRoute: ActivatedRoute
  ) {
    super();
  }

  ngOnInit(): void {
    this.sub.add(this.activatedRoute.queryParams.subscribe((queryParams: any) => {
      this.refreshCurrentTransaction();
    }));
    this.sub.add(
      rack.states.user.obs.subscribe(user => {
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

  async refreshCurrentTransaction() {
    const transaction = this.activatedRoute.snapshot.queryParams['transaction'];
    if(transaction) {
      this.currentTransaction = await getTransaction(transaction);
      rack.states.currentWallet.getTransactionOrders(transaction).then(
        (orders) => this.currentTransaction!.orders = orders
      );
    }
  }

  getTransactTime(transactionModel: TransactionModel): string {
    return new Date(transactionModel.time).toLocaleString();
  }


}

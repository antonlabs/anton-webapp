import {AfterViewInit, Component, OnInit} from '@angular/core';
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
export class WalletOrdersComponent extends AntiMemLeak implements OnInit, AfterViewInit {

  transactions: {[key: string]: TransactionModel} | undefined;
  transactionsList: TransactionModel[] | undefined;
  types = orderTypes;
  values = Object.values;
  mode: 'OPEN' | 'CLOSE' = 'OPEN';
  lastPaginationToken: PaginationToken | undefined;
  loadingElements = [
    'BTC',
    'SHIB',
    'ETH',
    'AVAX',
    'XEC',
    'MASK'
  ];
  loading = false;

  constructor(
    private walletService: WalletService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    super();
  }

  ngAfterViewInit(): void {
    document.getElementById('list')?.addEventListener('scroll', (event) => {
      const element: any = event.target;
      const isAtBottom = ( element.scrollHeight - element.scrollTop <= element.clientHeight + 50 );
      if(isAtBottom && this.lastPaginationToken) {
        rack.states.currentWallet.refreshTransactions(this.mode, this.lastPaginationToken).then((res) => {
          this.lastPaginationToken = res.lastKey;
        });
      }
    })
  }

  ngOnInit(): void {
    this.sub.add(
      rack.states.currentWallet.obs.subscribe((wallet) => {
        if(wallet.transactions) {
          this.transactions = wallet.transactions;
          this.transactionsList = this.sortTransaction(Object.values(wallet.transactions));
        }
      })
    );
    this.sub.add(this.activatedRoute.queryParams.subscribe((queryParams: any) => {
      if(this.mode !== queryParams.mode || this.transactionsList?.length === 0) {
        if(queryParams.mode) {
          this.mode = queryParams.mode;
        }
        this.lastPaginationToken = undefined;
        rack.states.currentWallet.set({
          transactions: {}
        });
        this.loading = true;
        rack.states.currentWallet.refreshTransactions(this.mode).then((res) => {
          this.lastPaginationToken = res.lastKey;
        }).finally(() => this.loading = false);
      }
    }));
  }

  sortTransaction(transactions: TransactionModel[]) {
    return (transactions ?? []).sort((b, a) => new Date(a.time).getTime() - new Date(b.time).getTime());
  }


}

import {Component, Input, OnInit} from '@angular/core';
import {TransactionModel} from "../../core/clients/models/transaction.model";
import {orderStatus, orderTypes} from "../helpers";
import {AntiMemLeak} from "../anti-mem-leak";
import {rack} from "../../states/app-state";
import {cryptoMap} from "../../crypto-map";

@Component({
  selector: 'app-transaction-card',
  templateUrl: './transaction-card.component.html',
  styleUrls: ['./transaction-card.component.scss']
})
export class TransactionCardComponent extends AntiMemLeak implements OnInit {

  @Input() transaction: TransactionModel | undefined;
  @Input() active: boolean | undefined;
  types = orderTypes;
  status = orderStatus;
  selectedTransaction: string | undefined;

  constructor() {
    super();
  }

  ngOnInit(): void {}

  round(n: number) {
    if(n) {
      return n.toFixed(2);
    }
    return "";
  }

  get imgSrc() {
    if(this.transaction) {
      const market = rack.val.currentWallet.val.symbolMarket ?? '';
      return `https://cryptologos.cc/logos/${cryptoMap[this.transaction.symbol.toUpperCase().replace(market, '')] ?? ''}-${this.transaction.symbol.toUpperCase().replace(market, '').toLowerCase()}-logo.svg`;
    }
    return '';
  }

  openInspectOrder() {

  }

}

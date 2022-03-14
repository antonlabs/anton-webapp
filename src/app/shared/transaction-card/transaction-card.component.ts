import {Component, Input, OnInit} from '@angular/core';
import {TransactionModel} from "../../core/clients/models/transaction.model";
import {orderStatus, orderTypes} from "../helpers";
import {ActivatedRoute, Router} from "@angular/router";
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

  constructor(
    private router: Router,
    private activatedRouter: ActivatedRoute
  ) {
    super();
  }

  ngOnInit(): void {}

  get imgSrc() {
    if(this.transaction) {
      return `https://cryptologos.cc/logos/${cryptoMap[this.transaction.symbol.toUpperCase()] ?? ''}-${this.transaction.symbol.toLowerCase()}-logo.svg`;
    }
    return '';
  }

}

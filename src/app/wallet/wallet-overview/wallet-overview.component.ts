import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Validators } from '@angular/forms';
import {AntiMemLeak} from "../../shared/anti-mem-leak";
import {WalletModel} from "../models/wallet.model";
import {OrderModel} from "../models/order.model";
import { state } from '@angular/animations';
import {states} from "../../states/app-state";

@Component({
  selector: 'app-wallet-overview',
  templateUrl: './wallet-overview.component.html',
  styleUrls: ['./wallet-overview.component.scss']
})
export class WalletOverviewComponent extends AntiMemLeak implements OnInit {
  name: string | undefined;
  wallet: WalletModel | undefined;
  actualBalance: number | undefined;
  linked: boolean | undefined;
  addBlackListForm = new FormGroup({
    symbol: new FormControl('', Validators.required)
  });
  orders: OrderModel[] = []

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.sub.add(
      states.user.obs.subscribe(state => {
        this.name = state.name;
        this.wallet = states.currentWallet.val;
      })
    );
    this.refreshExchangeLink();
  }

  async refreshExchangeLink() {
    try {
      this.actualBalance = await states.exchange.getClient()?.getActualBalance('BUSD');
      this.linked = true;
    } catch(e) {
      this.linked = false;
    }
  }


}

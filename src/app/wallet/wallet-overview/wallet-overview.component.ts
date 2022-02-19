import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Validators } from '@angular/forms';
import {AntiMemLeak} from "../../shared/anti-mem-leak";
import {WalletModel} from "../models/wallet.model";
import {OrderModel} from "../models/order.model";
import { state } from '@angular/animations';
import {states} from "../../states/app-state";
import {WalletService} from "../../shared/wallet.service";

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

  constructor(private walletService: WalletService) {
    super();
  }

  ngOnInit(): void {
    this.sub.add(
      states.user.obs.subscribe(state => {
        this.name = state.name;
      })
    );
    this.sub.add(
      states.currentWallet.obs.subscribe(wallet => {
        this.wallet = wallet;
        this.refreshExchangeLink();
      })
    );
  }

  async refreshExchangeLink() {
    try {
      this.actualBalance = await this.walletService.getActualBalance(this.wallet!);
      this.linked = true;
    } catch(e) {
      this.linked = false;
    }
  }


}

import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Validators } from '@angular/forms';
import {AppState, appState } from 'src/app/app-state';
import {AntiMemLeak} from "../../shared/anti-mem-leak";
import {WalletModel} from "../models/wallet.model";

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

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.sub.add(
      appState.subscribe(state => {
        this.name = state.props.user.name;
        this.wallet = AppState.getCurrentWallet();
      })
    );
    this.refreshExchangeLink();
  }

  async refreshExchangeLink() {
    try {
      this.actualBalance = await AppState.exchangeClient()?.getActualBalance('BUSD');
      this.linked = true;
    } catch(e) {
      this.linked = false;
    }
  }


}

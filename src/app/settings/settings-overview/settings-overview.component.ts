import { Component, OnInit } from '@angular/core';
import {WalletModel} from "../../wallet/models/wallet.model";
import {rack} from "../../states/app-state";
import {AntiMemLeak} from "../../shared/anti-mem-leak";
import {Router} from "@angular/router";
import {WalletService} from "../../shared/wallet.service";
import {UserStateProperties} from "../../states/user-state";

@Component({
  selector: 'app-settings-overview',
  templateUrl: './settings-overview.component.html',
  styleUrls: ['./settings-overview.component.scss']
})
export class SettingsOverviewComponent extends AntiMemLeak implements OnInit {
  wallet: WalletModel | undefined;
  user: UserStateProperties | undefined;

  constructor(
  ) {
    super();
  }

  ngOnInit(): void {
    this.sub.add(
      rack.states.currentWallet.obs.subscribe(wallet => {
        this.wallet = wallet;
      })
    );
    this.sub.add(
      rack.states.user.obs.subscribe(user => {
        this.user = user;
      })
    )
  }

  obfuscate(key: string | undefined) {
    if(key) {
      return [...Array(key?.length - 5).keys()].map(() => '*').join('') + key?.slice(-5);
    }
    return '';
  }


}

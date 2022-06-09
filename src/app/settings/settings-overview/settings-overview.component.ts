import { Component, OnInit } from '@angular/core';
import {WalletModel} from "../../wallet/models/wallet.model";
import {rack} from "../../states/app-state";
import {AntiMemLeak} from "../../shared/anti-mem-leak";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {WalletService} from "../../shared/wallet.service";
import {User} from "../../core/clients/models/user.model";
import {UserStateProperties} from "../../states/user-state";

@Component({
  selector: 'app-settings-overview',
  templateUrl: './settings-overview.component.html',
  styleUrls: ['./settings-overview.component.scss']
})
export class SettingsOverviewComponent extends AntiMemLeak implements OnInit {
  wallet: WalletModel | undefined;
  addBlackListForm = new FormGroup({
    symbol: new FormControl('', Validators.required)
  });
  user: UserStateProperties | undefined;
  blacklistLoading = false;
  blacklistError: string | undefined;

  constructor(
    private router: Router,
    private walletService: WalletService,
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

  async deleteBlacklistItem(symbol: string): Promise<void> {
    if(rack.states.preferences.val.blacklistDeleteConfirmation) {
      this.router.navigate(['/overview'], {queryParams: {modal: 'deleteBlacklistSymbol', symbol}})
    }else {
      this.blacklistLoading = true;
      try{
        await this.walletService.deleteBlacklistSymbol(symbol);
      }catch(e) {
        this.blacklistError = $localize`Ops...there are some errors during blacklist update, retry later`;
      }finally {
        this.blacklistLoading = false;
      }
    }
  }


}

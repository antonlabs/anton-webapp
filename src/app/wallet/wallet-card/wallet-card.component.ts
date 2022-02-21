import {Component, Input, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {marketsAvailable} from "../first-wallet-creation/configure-wallet/configure-wallet.component";
import {WalletModel} from "../models/wallet.model";
import {WalletPlan, WalletService} from "../../shared/wallet.service";
import {AntiMemLeak} from "../../shared/anti-mem-leak";
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-wallet-card',
  templateUrl: './wallet-card.component.html',
  styleUrls: ['./wallet-card.component.scss']
})
export class WalletCardComponent extends AntiMemLeak implements OnInit {
  loading = false;
  private _wallet: WalletModel | undefined;
  walletPlan: WalletPlan = 'FREE';
  walletBudgetSubscription = new Subscription();

  @Input()
  set wallet(val: WalletModel | undefined) {
    if(val) {
      this._wallet = val;
      this.settingsForm = new FormGroup({
        walletBudget: new FormControl((val.valuePerUnits ?? 0) * (val.units ?? 0), Validators.required),
        symbolMarket: new FormControl(val.symbolMarket, Validators.required),
        autoReinvest: new FormControl(val.autoReinvest)
      });
      this.subscribeToBudgetChange();
    }
  }

  constructor(public walletService: WalletService) {
    super();
  }

  ngOnInit(): void {
  }

  subscribeToBudgetChange() {
    this.walletBudgetSubscription.unsubscribe();
    this.walletBudgetSubscription = new Subscription();
    this.walletPlan = this.walletService.getWalletPlan(parseFloat(this.walletBudgetControl.value));
    this.walletBudgetSubscription.add(
      this.walletBudgetControl.valueChanges.subscribe(budget => {
        this.walletPlan = this.walletService.getWalletPlan(parseFloat(budget));
      })
    );
  }

  settingsForm = new FormGroup({
    walletBudget: new FormControl(50, [Validators.min(50), Validators.max(50000)]),
    symbolMarket: new FormControl('EUR'),
    autoReinvest: new FormControl(false)
  });

  symbols = marketsAvailable;

  get walletBudgetControl(): FormControl {
    return this.settingsForm.controls['walletBudget'] as FormControl;
  }

  get autoReinvestControl(): FormControl {
    return this.settingsForm.controls['autoReinvest'] as FormControl;
  }

  async submitWallet() {
    this.loading = true;
    try{
      await this.walletService.updateWallet({
        autoReinvest: this.settingsForm.value.autoReinvest,
        symbolMarket: this.settingsForm.value.symbolMarket,
        units: this.settingsForm.value.walletBudget / 50,
        valuePerUnits: 50
      });
    }catch(e) {
      console.error(e);
    }finally {
      this.loading = false;
    }

  }



}

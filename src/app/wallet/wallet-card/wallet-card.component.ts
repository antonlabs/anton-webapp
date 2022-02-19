import {Component, Input, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {marketsAvailable} from "../first-wallet-creation/configure-wallet/configure-wallet.component";
import {WalletModel} from "../models/wallet.model";
import {WalletService} from "../../shared/wallet.service";

@Component({
  selector: 'app-wallet-card',
  templateUrl: './wallet-card.component.html',
  styleUrls: ['./wallet-card.component.scss']
})
export class WalletCardComponent implements OnInit {
  loading = false;
  private _wallet: WalletModel | undefined;

  @Input()
  set wallet(val: WalletModel | undefined) {
    if(val) {
      this._wallet = val;
      this.settingsForm = new FormGroup({
        walletBudget: new FormControl((val.valuePerUnits ?? 0) * (val.units ?? 0), Validators.required),
        symbolMarket: new FormControl(val.symbolMarket, Validators.required),
        autoReinvest: new FormControl(val.autoReinvest)
      })
    }
  }

  constructor(private walletService: WalletService) {}

  ngOnInit(): void {
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

import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {marketsAvailable} from "../first-wallet-creation/configure-wallet/configure-wallet.component";

@Component({
  selector: 'app-wallet-card',
  templateUrl: './wallet-card.component.html',
  styleUrls: ['./wallet-card.component.scss']
})
export class WalletCardComponent implements OnInit {
  loading = false;

  constructor() {
  }

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

  submitWallet() {
    console.log(this.settingsForm.value);
  }

}

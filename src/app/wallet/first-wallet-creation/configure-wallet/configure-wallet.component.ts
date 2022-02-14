import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import { AppState } from 'src/app/app-state';
import {WalletService} from "../../../shared/wallet.service";

export const marketsAvailable = [
  'EUR',
  'USD',
  'BUSD',
  'USDT',
];

@Component({
  selector: 'app-configure-wallet',
  templateUrl: './configure-wallet.component.html',
  styleUrls: ['./configure-wallet.component.scss']
})
export class ConfigureWalletComponent implements OnInit {
  loading = false;
  error: string | undefined;

  form = new FormGroup({
    investment: new FormControl(50, [Validators.min(50), Validators.max(50000)]),
    symbolMarket: new FormControl('EUR')
  });

  symbols = marketsAvailable;

  constructor(private walletService: WalletService) { }

  ngOnInit(): void {}

  async submit() {
    const formValue = this.form.value;
    const wallet = AppState.getCurrentWallet();
    if (this.form.valid) {
      wallet!.units = Math.floor(formValue.investment / 50);
      wallet!.valuePerUnits = 50;
      try {
        this.loading = true;
        await this.walletService.updateWallet(wallet!);
      }catch(e) {
        this.error = $localize`Ops...you have find out an unexpected error, please retry later`;
      }finally {
        this.loading = false;
      }
    }else {
      this.error = $localize`You have to insert a valid value of money`;
    }
  }

  get control(): FormControl {
    return this.form.controls['investment'] as FormControl;
  }



}

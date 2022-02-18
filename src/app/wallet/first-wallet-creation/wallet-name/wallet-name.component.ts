import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {WalletService} from "../../../shared/wallet.service";
import { refreshWallets } from 'src/app/shared/helpers';
import { states } from 'src/app/states/app-state';

@Component({
  selector: 'app-wallet-name',
  templateUrl: './wallet-name.component.html',
  styleUrls: ['./wallet-name.component.scss']
})
export class WalletNameComponent implements OnInit {

  form = new FormGroup({
    name: new FormControl('', Validators.required)
  });
  error: string | undefined;
  redirectToDashboard: boolean = false;
  loading = false;

  constructor(
    private router: Router,
    private walletService: WalletService
  ) { }

  ngOnInit(): void {
    refreshWallets();
  }

  async createWallet() {
    this.loading = true;
    this.redirectToDashboard = false;
    try {
      await this.walletService.createWallet(this.form.value);
      states.currentWallet.set(this.form.value);
      states.currentWallet.store();
      this.router.navigate(['/create-wallet', 'wallet-platform'])
    }catch(e: any) {
      if(JSON.parse(e).reason === 'WALLET_NUMBER_EXCEED') {
        states.currentWallet.set(this.form.value);
        this.error = $localize`You have another wallet already, its name is ${states.currentWallet?.val.name}`;
        this.redirectToDashboard = true;
      }else {
        this.error = $localize`Ops...you find an unexpected error, retry later`;
      }
    }finally {
      this.loading = false;
    }
  }

}
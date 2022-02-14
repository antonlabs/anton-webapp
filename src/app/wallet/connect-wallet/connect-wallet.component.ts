import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {WalletService} from "../../shared/wallet.service";
import {AppState} from "../../app-state";
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-connect-wallet',
  templateUrl: './connect-wallet.component.html',
  styleUrls: ['./connect-wallet.component.scss']
})
export class ConnectWalletComponent implements OnInit {

  error: string | undefined;
  loading = false;

  form = new FormGroup({
    accessKey: new FormControl('', Validators.required),
    secretKey: new FormControl('', Validators.required)
  })

  constructor(
    private router: Router,
    private walletService: WalletService
  ) { }

  ngOnInit(): void {
  }

  async connectWallet() {
    this.loading = true;
    let wallet = AppState.getCurrentWallet();
    if(!this.form.valid) {
      this.error = $localize`You must insert API Key and Secret key, you can click on 'Skip' if you want do it after`;
      this.loading = false;
      return;
    }

    wallet = {
      ...wallet,
      ...this.form.value
    };

    try {
      await this.walletService.updateWallet(wallet!);
      this.router.navigate(['/create-wallet', 'wallet-configuration']);
    }catch(e) {
      this.error = $localize`Error during wallet keys configuration`
    }finally {
      this.loading = false;
    }
  }

}

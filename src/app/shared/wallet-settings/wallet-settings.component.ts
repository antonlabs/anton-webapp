import { Component, OnInit } from '@angular/core';
import {WalletService} from "../wallet.service";
import {FormControl, FormGroup} from "@angular/forms";
import {Router} from "@angular/router";

@Component({
  selector: 'app-wallet-settings',
  templateUrl: './wallet-settings.component.html',
  styleUrls: ['./wallet-settings.component.scss']
})
export class WalletSettingsComponent implements OnInit {

  loading = false;
  error: string | undefined;

  form = new FormGroup({
    alias: new FormControl('')
  });

  constructor(
    private router: Router,
    private walletService: WalletService
  ) { }

  ngOnInit(): void {
  }

  async setAlias() {
    this.loading = true;
    try{
      await this.walletService.updateWallet(
        this.form.value
      );
    }catch(e) {
      this.error = $localize`Ops...somethings went wrong with your request, please retry later`;
    }finally {
      this.loading = false;
    }
  }

  async deleteWallet() {
    this.router.navigate(['/overview'], {
      queryParams: {
        modal: 'deleteWalletMethods',
        wallet: 'prva'
      }
    })
  }
}

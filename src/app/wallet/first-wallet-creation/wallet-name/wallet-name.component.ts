import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {WalletService} from "../../../shared/wallet.service";

@Component({
  selector: 'app-wallet-name',
  templateUrl: './wallet-name.component.html',
  styleUrls: ['./wallet-name.component.scss']
})
export class WalletNameComponent implements OnInit {

  form = new FormGroup({
    name: new FormControl('', Validators.required)
  });

  constructor(
    private router: Router,
    private walletService: WalletService
  ) { }

  ngOnInit(): void {
  }

  async createWallet() {
    await this.walletService.updateWallet(this.form.value);
    this.router.navigate(['/first-access', 'connect'])
  }

}

import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from '@angular/router';
import {rack} from 'src/app/states/app-state';
import {WalletService} from "../../../shared/wallet.service";
import {WalletModel} from "../../models/wallet.model";
import {AntiMemLeak} from "../../../shared/anti-mem-leak";

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
export class ConfigureWalletComponent extends AntiMemLeak implements OnInit {
  loading = false;
  error: string | undefined;

  wallet: WalletModel | undefined;

  symbols = marketsAvailable;

  constructor(
    private walletService: WalletService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    super();
  }

  ngOnInit(): void {
    this.sub.add(
      rack.states.currentWallet.obs.subscribe(wallet => this.wallet = wallet)
    );
  }

  async submit() {
    this.router.navigateByUrl('/');
  }

}

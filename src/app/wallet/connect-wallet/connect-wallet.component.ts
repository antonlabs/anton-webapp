import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {WalletService} from "../../shared/wallet.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import { AntiMemLeak } from 'src/app/shared/anti-mem-leak';
import {ModalService} from "../../modal.service";
import {errorMessages, getErrorMessage, refreshWallets} from "../../shared/helpers";

@Component({
  selector: 'app-connect-wallet',
  templateUrl: './connect-wallet.component.html',
  styleUrls: ['./connect-wallet.component.scss']
})
export class ConnectWalletComponent extends AntiMemLeak implements OnInit {

  error: string | undefined;
  loading = false;
  mode: 'modal' | 'page' | undefined;
  spotNotEnabled = false;
  bnbFeeDisabled = false;
  form = new FormGroup({
    accessKey: new FormControl('', Validators.required),
    secretKey: new FormControl('', Validators.required)
  });

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private walletService: WalletService,
    public modalService: ModalService
  ) {
    super();
  }

  ngOnInit(): void {
    this.sub.add(
      this.activatedRoute.queryParams.subscribe(params => {
        this.mode = !!params['modal'] ? 'modal' : 'page';
      })
    );
  }

  async connectWallet() {
    this.loading = true;
    if(!this.form.valid) {
      this.error = $localize`You must insert API Key and Secret key, you can click on 'Skip' if you want do it after`;
      this.loading = false;
      return;
    }
    try {
      await this.walletService.updateWallet(this.form.value);
      refreshWallets();
      if(this.mode === 'page') {
        this.router.navigate(['/create-wallet', 'wallet-configuration']);
      }else {
        this.modalService.closeModal();
      }
    }catch(e: any) {
      const message = JSON.parse(e).reason;
      this.spotNotEnabled = message === 'SPOT_TRADING_DISABLED';
      this.bnbFeeDisabled = message === 'BNB_FEE_DISABLED';
      this.error = getErrorMessage(message);
    }finally {
      this.loading = false;
    }
  }

}

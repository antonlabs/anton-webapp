import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {WalletType} from "../../enums/wallet-type.enum";
import {WalletService} from "../../../shared/wallet.service";
import {rack} from "../../../states/app-state";
import {refreshWallets} from "../../../shared/helpers";

@Component({
  selector: 'app-wallet-platform',
  templateUrl: './wallet-platform.component.html',
  styleUrls: ['./wallet-platform.component.scss']
})
export class WalletPlatformComponent implements OnInit {

  currentSelection: WalletType | undefined;
  walletType = WalletType;
  loading = false;
  error: string | undefined;
  redirectToDashboard: boolean = false;

  constructor(
    private router: Router,
    private walletService: WalletService
  ) { }

  ngOnInit(): void {
  }

  async next() {
    this.loading = true;
    this.redirectToDashboard = false;
    try {
      const wallet = await this.walletService.createWallet({type: WalletType.BINANCE});
      console.log(wallet);
      rack.states.currentWallet.set(wallet);
      console.log(rack.states.currentWallet.val);
      rack.states.currentWallet.store();
      this.router.navigate(['/create-wallet', 'connect'])
    }catch(e: any) {
      if(JSON.parse(e).reason === 'WALLET_NUMBER_EXCEED') {
        await refreshWallets();
        this.error = $localize`You have another wallet already, its name is ${rack.states.currentWallet?.val.name}`;
        this.redirectToDashboard = true;
      }else {
        this.error = $localize`Ops...you find an unexpected error, retry later`;
      }
    }finally {
      this.loading = false;
    }
  }



}

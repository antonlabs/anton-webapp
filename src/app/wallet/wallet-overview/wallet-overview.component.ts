import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AntiMemLeak} from "../../shared/anti-mem-leak";
import {StrategyStateType, WalletModel} from "../models/wallet.model";
import {rack} from "../../states/app-state";
import {WalletService} from "../../shared/wallet.service";
import {Router} from '@angular/router';
import {NotificationService} from "../../shared/notification.service";
import {getErrorMessage, getTransactions, refreshBalances, refreshWallets} from "../../shared/helpers";
import {TransactionModel} from "../../core/clients/models/transaction.model";
import {DailyTickerModel} from "../../core/clients/models/daily-ticker.model";



@Component({
  selector: 'app-wallet-overview',
  templateUrl: './wallet-overview.component.html',
  styleUrls: ['./wallet-overview.component.scss']
})
export class WalletOverviewComponent extends AntiMemLeak implements OnInit {
  name: string | undefined;
  wallet: WalletModel | undefined;
  actualBalance: number | undefined;
  linked: boolean | undefined;
  playLoading = false;
  closedTransactions: TransactionModel[] = [];
  strategyState = StrategyStateType;
  getErrorMessage = getErrorMessage;
  loadingReUpdateWallet = false;
  loadingEnableBnbFee = false;
  chartMode: 'earnings' | 'balances' = 'earnings';
  checkingInterval: any;
  btcValue: DailyTickerModel | undefined;


  constructor(
    private router: Router,
    private walletService: WalletService,
    private notificationService: NotificationService
  ) {
    super();
  }

  ngOnInit(): void {
    this.sub.add(
      rack.states.user.obs.subscribe(state => {
        this.name = state.name;
      })
    );
    this.sub.add(
      rack.states.currentWallet.obs.subscribe(wallet => {
        this.wallet = wallet;
        if(!this.checkingInterval && wallet.strategy?.state === StrategyStateType.DEPLOYING) {
          /*this.checkingInterval = setInterval(() => {
            refreshWallets();
          }, 10000);*/
        }
        if(this.wallet.name) {
          if(wallet.balances.length === 0) {
            refreshBalances();
          }
          this.refreshExchangeLink();
        }
      })
    );
    rack.states.exchange.getClient()?.getDailyTicker('BTCBUSD').then((v) => {
      this.btcValue = v;
      console.log(v);
    });
    getTransactions('CLOSE').then(transactions => {
      this.closedTransactions = transactions.data.filter(o => o.earnings !== undefined);
    });
  }

  slice(elements: any[]) {
    return elements.slice(0, 10);
  }

  async refreshExchangeLink() {
    try {
      this.actualBalance = await this.walletService.getActualBalance(this.wallet!);
      this.linked = true;
    } catch(e) {
      this.linked = false;
      this.actualBalance = NaN;
    }
  }

  async reValidateKeys() {
    this.loadingReUpdateWallet = true;
    try{
      await this.walletService.updateWallet(this.wallet ?? {});
    }catch(e) {
      throw e;
    }finally {
      this.loadingReUpdateWallet = false;
    }
  }

  get walletBalance(): number | undefined {
    return this.wallet?.balances.slice(-1)[0]?.balance;
  }

  get totalPercentage(): number | undefined {
    if(this.wallet?.totalEarnings !== undefined && this.wallet?.budget !== undefined) {
      return ((this.wallet.totalEarnings) / (this.wallet.budget)) * 100;
    }
    return undefined;
  }

  get totalEarnings(): number | undefined {
    if(this.wallet?.totalEarnings !== undefined) {
      return this.wallet.totalEarnings;
    }
    return undefined;
  }

  async enableBnbFees() {
    if(this.wallet?.name) {
      this.loadingEnableBnbFee = true;
      try{
        await this.walletService.enableBnbFees(this.wallet.name);
      }catch(e) {
        throw e;
      }finally {
        this.loadingEnableBnbFee = false;
      }
    }
  }

  async playStrategy() {
    this.playLoading = true;
    try {
      if(this.wallet?.strategy?.state === StrategyStateType.STOPPED || this.wallet?.strategy?.state === StrategyStateType.DEPLOYED) {
        this.router.navigate(['/'], {queryParams: {
          modal: 'runStrategyDescription'
        }})
      }else {
        await this.walletService.stopStrategy(rack.states.currentWallet.val.name);
        this.notificationService.success($localize`You have successful stop your wallet strategy`);
      }
    }catch(e) {
      this.notificationService.error($localize`Ops...you have found an error, contact us or retry later`)
    }finally {
      this.playLoading = false;
    }
  }



}

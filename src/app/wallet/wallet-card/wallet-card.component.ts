import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {marketsAvailable} from "../first-wallet-creation/configure-wallet/configure-wallet.component";
import {WalletModel} from "../models/wallet.model";
import {WalletPlan, WalletService} from "../../shared/wallet.service";
import {AntiMemLeak} from "../../shared/anti-mem-leak";
import { Subscription } from 'rxjs';
import {NotificationService} from "../../shared/notification.service";
import {Router} from "@angular/router";
import {rack} from "../../states/app-state";

@Component({
  selector: 'app-wallet-card',
  templateUrl: './wallet-card.component.html',
  styleUrls: ['./wallet-card.component.scss']
})
export class WalletCardComponent extends AntiMemLeak implements OnInit {
  loading = false;
  private _wallet: WalletModel | undefined;
  walletPlan: WalletPlan = 'FREE';
  walletBudgetSubscription = new Subscription();
  limitMax: number | undefined = undefined;
  walletName: string | undefined;


  @Input() mode: 'wizard' | 'page' = 'page';

  @Input()
  set wallet(val: WalletModel | undefined) {
    if(val) {
      this._wallet = val;
      this.settingsForm = new FormGroup({
        walletBudget: new FormControl(val.budget, Validators.required),
        symbolMarket: new FormControl(val.symbolMarket, Validators.required),
        autoReinvest: new FormControl(val.autoReinvest)
      });
      this.subscribeToBudgetChange();
    }
  }

  @Output() submit = new EventEmitter<string>();
  @Output() error = new EventEmitter<string>();

  constructor(
    public walletService: WalletService,
    private router: Router,
    private notificationService: NotificationService
  ) {
    super();
  }

  ngOnInit(): void {
    this.sub.add(
      rack.states.currentWallet.obs.subscribe(wallet => {
        if(this.walletName !== wallet.name) {
          this.walletName = wallet.name;
          rack.states.currentWallet.refreshStableAvailable();
        }
        this.limitMax = wallet.stableAmount['BUSD'];
        console.log(this.limitMax);
      })
    );
  }

  getMaxOrderValueByBudget(val: number) {
  }

  subscribeToBudgetChange() {
    this.walletBudgetSubscription.unsubscribe();
    this.walletBudgetSubscription = new Subscription();
    this.walletPlan = this.walletService.getWalletPlan(parseFloat(this.walletBudgetControl.value));
    this.walletBudgetSubscription.add(
      this.walletBudgetControl.valueChanges.subscribe(budget => {
        this.walletPlan = this.walletService.getWalletPlan(parseFloat(budget));
      })
    );
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

  async submitWallet() {
    this.loading = true;
    try {
      this.submit.emit(await this.walletService.updateWallet({
        autoReinvest: this.settingsForm.value.autoReinvest,
        symbolMarket: this.settingsForm.value.symbolMarket,
        budget: this.settingsForm.value.walletBudget,
        maxOrderValue: 50
      }));
      if(this.mode === 'wizard') {
        location.href = '/';
      }
      this.notificationService.success($localize`You successfully updated this wallet!`);
    }catch(e: any) {
      const error = JSON.parse(e.message);
      if(error.reason === 'KEY_NOT_VALID') {
        this.error.emit($localize`You have to put valid keys to confirm wallet creation, if you can't please click on skip, you can do it later`);
      }else {
        this.error.emit($localize`Ops there are some errors, retry later`);
      }
      console.error(e);
    }finally {
      this.loading = false;
    }

  }



}

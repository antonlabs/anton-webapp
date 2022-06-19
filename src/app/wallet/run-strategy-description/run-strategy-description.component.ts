import { Component, OnInit } from '@angular/core';
import {rack} from "../../states/app-state";
import {WalletService} from "../../shared/wallet.service";
import {NotificationService} from "../../shared/notification.service";
import {Router} from "@angular/router";
import {FormControl} from "@angular/forms";

@Component({
  selector: 'app-run-strategy-description',
  templateUrl: './run-strategy-description.component.html',
  styleUrls: ['./run-strategy-description.component.scss']
})
export class RunStrategyDescriptionComponent implements OnInit {

  showStrategy = false;
  loading = false;
  accepted = new FormControl(false);

  constructor(
    private router: Router,
    private walletService: WalletService,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
  }

  changeAccepted(event: any) {
    this.accepted.setValue(event);
  }

  async runStrategyMarket() {
    this.loading = true;
    try {
      await this.walletService.playStrategy(rack.states.currentWallet.val.name);
      this.router.navigate(['/']);
      setTimeout(() => {
        this.notificationService.success($localize`You have successful play your wallet strategy`);
      }, 1000);
    }catch(e) {
      console.log(e);
    }finally {
      this.loading = false;
    }
  }

}

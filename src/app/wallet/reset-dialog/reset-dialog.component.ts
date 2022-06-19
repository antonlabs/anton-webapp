import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {AntiMemLeak} from "../../shared/anti-mem-leak";
import {WalletService} from "../../shared/wallet.service";
import {NotificationService} from "../../shared/notification.service";

@Component({
  selector: 'app-reset-dialog',
  templateUrl: './reset-dialog.component.html',
  styleUrls: ['./reset-dialog.component.scss']
})
export class ResetDialogComponent extends AntiMemLeak implements OnInit {
  loading = false;
  budget: number | undefined;
  error: string | undefined;

  constructor(
    private activatedRoute: ActivatedRoute,
    private walletService: WalletService,
    private router: Router,
    private notificationService: NotificationService
  ) {
    super();
  }

  ngOnInit(): void {
    this.sub.add(this.activatedRoute.queryParams.subscribe((query: any) => {
      this.budget = query.budget;
    }));
  }

  async submitWallet() {
    this.loading = true;
    try {
      await this.walletService.updateWallet({
        budget: this.budget
      });
      setTimeout(() => this.notificationService.success($localize`You successfully updated this wallet!`), 1000);
      this.router.navigate([''], {queryParams: {}});
    }catch(e: any) {
      const error = JSON.parse(e.message);
      if(error.reason === 'KEY_NOT_VALID') {
        this.error = $localize`You have to put valid keys to confirm wallet creation, if you can't please click on skip, you can do it later`;
      }else {
        this.error = $localize`Ops there are some errors, retry later`;
      }
      console.error(e);
    } finally {
      this.loading = false;
    }
  }



}

import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {AntiMemLeak} from "../../shared/anti-mem-leak";
import {ModalService} from "../../modal.service";
import { FormControl } from '@angular/forms';
import {WalletService} from "../../shared/wallet.service";
import {rack} from "../../states/app-state";

@Component({
  selector: 'app-delete-blacklist-symbol',
  templateUrl: './delete-blacklist-symbol.component.html',
  styleUrls: ['./delete-blacklist-symbol.component.scss']
})
export class DeleteBlacklistSymbolComponent extends AntiMemLeak implements OnInit {
  symbol: string | undefined;
  neverShowThisPopup = new FormControl(false);
  loading = false;
  error: string | undefined;

  constructor(
    private walletService: WalletService,
    private activateRouter: ActivatedRoute,
    private router: Router,
    public modalService: ModalService
  ) {
    super();
  }

  ngOnInit(): void {
    this.sub.add(
      this.activateRouter.queryParams.subscribe(queryParams => {
        this.symbol = queryParams['symbol'];
        if(!this.symbol) this.modalService.closeModal();
      })
    );
    this.neverShowThisPopup.valueChanges.subscribe(() => rack.states.preferences.set({
      blacklistDeleteConfirmation: !rack.states.preferences.val.blacklistDeleteConfirmation
    }));
  }

  async delete(): Promise<void> {
    this.loading = true;
    try {
      await this.walletService.deleteBlacklistSymbol(this.symbol!);
      this.modalService.closeModal();
      this.router.navigate(['/overview'], {queryParams: {dialog: $localize`Symbol ${this.symbol} removed from blacklist!`}})
    }catch(e) {
      this.error = $localize`Ops...there are some error during delete item deletion`;
    }finally {
      this.loading = false;
    }

  }

}

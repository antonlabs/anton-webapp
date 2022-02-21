import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {AntiMemLeak} from "../../shared/anti-mem-leak";
import {ModalService} from "../../modal.service";
import { states } from 'src/app/states/app-state';
import { FormControl } from '@angular/forms';
import {WalletService} from "../../shared/wallet.service";

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
    this.neverShowThisPopup.valueChanges.subscribe(() => states.preferences.set({
      blacklistDeleteConfirmation: !states.preferences.val.blacklistDeleteConfirmation
    }));
  }

  async delete(): Promise<void> {
    this.loading = true;
    try{
      await this.walletService.deleteBlacklistSymbol(this.symbol!);
    }catch(e) {
      this.error = $localize`Ops...there are some error during delete item deletion`;
    }finally {
      this.loading = false;
    }

  }

}

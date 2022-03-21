import {Component, Input, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import { ModalService } from 'src/app/modal.service';
import {rack} from 'src/app/states/app-state';
import {WalletService} from "../../shared/wallet.service";
import {AntiMemLeak} from "../../shared/anti-mem-leak";
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-to-blacklist',
  templateUrl: './add-to-blacklist.component.html',
  styleUrls: ['./add-to-blacklist.component.scss']
})
export class AddToBlacklistComponent extends AntiMemLeak implements OnInit {
  loading = false;
  error: string | undefined;
  currentPageIndex = 0;
  symbolsSelected = [];
  form = new FormGroup({
    symbols: new FormControl(rack.states.currentWallet.val.blacklist ?? [], Validators.required)
  });
  pages: [][] = [];

  constructor(
    public modalService: ModalService,
    public router: Router,
    public walletService: WalletService
  ) { super(); }

  ngOnInit(): void {
    this.sub.add(
      this.symbolsFormControl.valueChanges.subscribe((values) => {
        console.log(values);
        this.symbolsSelected = values;
      })
    );
  }

  get symbolsFormControl(): FormControl {
    return this.form.controls['symbols'] as FormControl;
  }

  async addToBlacklist() {
    this.loading = true;
    try{
      await this.walletService.updateWallet({blacklist: this.symbolsSelected});
      this.modalService.closeModal();
      this.router.navigate(['/overview'], {queryParams: {dialog: $localize`You have update your blacklist!`}})
    }catch(e: any) {
      this.error = $localize`Ops...it seems that this function is not available right now, please retry later`
    }finally {
      this.loading = false;
    }
  }
}

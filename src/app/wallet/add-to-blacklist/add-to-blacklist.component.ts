import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import { ModalService } from 'src/app/modal.service';
import {rack} from 'src/app/states/app-state';
import {WalletService} from "../../shared/wallet.service";

@Component({
  selector: 'app-add-to-blacklist',
  templateUrl: './add-to-blacklist.component.html',
  styleUrls: ['./add-to-blacklist.component.scss']
})
export class AddToBlacklistComponent implements OnInit {
  loading = false;
  error: string | undefined;
  form = new FormGroup({
    symbols: new FormControl([], Validators.required)
  });

  constructor(
    public modalService: ModalService,
    public walletService: WalletService
  ) { }

  ngOnInit(): void {
    this.symbolsFormControl.valueChanges.subscribe(console.log);
  }

  get symbolsFormControl(): FormControl {
    return this.form.controls['symbols'] as FormControl;
  }

  async addToBlacklist() {
    if(this.form.valid) {
      const value = this.form.value;
      const blacklist = rack.states.currentWallet.val.blacklist ?? [];
      const symbol = value.cryptoName + '-' + value.cryptoMarket;
      if(blacklist.filter(item => item === symbol).length === 0) {
        blacklist.push(symbol);
        this.loading = true;
        try{
          await this.walletService.updateWallet({blacklist});
        }catch(e: any) {
          this.error = $localize`Ops...it seems that this function is not available right now, please retry later`
        }finally {
          this.loading = false;
        }
      }else {
        this.error = $localize`This symbol already exists`;
      }
    }else {
      this.error = $localize`You have to insert crypto name`;
    }
  }



}

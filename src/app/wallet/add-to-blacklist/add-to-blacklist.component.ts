import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import { ModalService } from 'src/app/modal.service';
import {WalletService} from "../../shared/wallet.service";
import {AppState} from "../../app-state";

@Component({
  selector: 'app-add-to-blacklist',
  templateUrl: './add-to-blacklist.component.html',
  styleUrls: ['./add-to-blacklist.component.scss']
})
export class AddToBlacklistComponent implements OnInit {
  loading = false;
  error: string | undefined;
  form = new FormGroup({
    cryptoName: new FormControl('', Validators.required),
    cryptoMarket: new FormControl('all', Validators.required)
  });

  constructor(
    public modalService: ModalService,
    public walletService: WalletService
  ) { }

  ngOnInit(): void {
  }

  async addToBlacklist() {
    if(this.form.valid) {
      const value = this.form.value;
      const blacklist = AppState.getCurrentWallet()?.blacklist ?? [];
      blacklist.push(value.cryptoName+value.cryptoMarket);
      this.loading = true;
      try{
        await this.walletService.updateWallet({blacklist});
      }catch(e: any) {
        this.error = $localize`Ops...it seems that this function is not available right now, please retry later`
      }finally {
        this.loading = false;
      }
    }else {
      this.error = $localize`You have to insert crypto name`;
    }
  }



}

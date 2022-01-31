import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Validators } from '@angular/forms';

@Component({
  selector: 'app-wallet-overview',
  templateUrl: './wallet-overview.component.html',
  styleUrls: ['./wallet-overview.component.scss']
})
export class WalletOverviewComponent implements OnInit {

  addBlackListForm = new FormGroup({
    symbol: new FormControl('', Validators.required)
  })

  settingsForm = new FormGroup({
    market: new FormControl('BUSD', Validators.required),
    walletBudget: new FormControl('200$', Validators.required),
    autoReinvest: new FormControl(false)
  })

  constructor() { }

  ngOnInit(): void {
  }

}

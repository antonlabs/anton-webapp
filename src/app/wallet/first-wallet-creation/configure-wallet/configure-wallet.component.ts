import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-configure-wallet',
  templateUrl: './configure-wallet.component.html',
  styleUrls: ['./configure-wallet.component.scss']
})
export class ConfigureWalletComponent implements OnInit {
  loading = false;

  form = new FormGroup({
    investment: new FormControl(50, [Validators.min(50), Validators.max(50000)]),
    market: new FormControl('EUR')
  });

  symbols = [
    'EUR',
    'USD',
    'BUSD',
    'USDT',
  ];

  constructor() { }

  ngOnInit(): void {
  }

}

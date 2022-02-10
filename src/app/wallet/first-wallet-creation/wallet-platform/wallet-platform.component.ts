import {Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import {WalletType} from "../../enums/wallet-type.enum";

@Component({
  selector: 'app-wallet-platform',
  templateUrl: './wallet-platform.component.html',
  styleUrls: ['./wallet-platform.component.scss']
})
export class WalletPlatformComponent implements OnInit {

  currentSelection: WalletType | undefined;
  walletType = WalletType;

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

}

import { Component, OnInit } from '@angular/core';
import {refreshWallets} from "../../shared/helpers";
import { Router } from '@angular/router';
import {AuthService} from "../../auth/auth.service";

@Component({
  selector: 'app-wallet-create-layout',
  templateUrl: './wallet-create-layout.component.html',
  styleUrls: ['./wallet-create-layout.component.scss']
})
export class WalletCreateLayoutComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    refreshWallets();
  }

  async refreshWallets() {
  }

  logout() {
    this.authService.logout();
    location.reload();
  }

}

import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {AntiMemLeak} from "../../shared/anti-mem-leak";
import {AuthService} from "../../auth/auth.service";

@Component({
  selector: 'app-wallet-layout',
  templateUrl: './wallet-layout.component.html',
  styleUrls: ['./wallet-layout.component.scss']
})
export class WalletLayoutComponent extends AntiMemLeak implements OnInit {
  constructor(
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) {
    super();
  }

  ngOnInit(): void {
  }

  liClass(liId: string) {
    const route = this.router.url.split('/')[1];
    return route === liId ? 'active' : '';
  }

  async logout() {
    this.authService.logout();
    location.reload();
  }

}

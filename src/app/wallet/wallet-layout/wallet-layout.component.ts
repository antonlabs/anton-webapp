import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {AntiMemLeak} from "../../shared/anti-mem-leak";
import {AuthService} from "../../auth/auth.service";
import {UserService} from "../../shared/user.service";
import {appState, AppState} from "../../app-state";

@Component({
  selector: 'app-wallet-layout',
  templateUrl: './wallet-layout.component.html',
  styleUrls: ['./wallet-layout.component.scss']
})
export class WalletLayoutComponent extends AntiMemLeak implements OnInit {

  constructor(
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) {
    super();
  }

  ngOnInit(): void {
    appState.subscribe((state) => this.checkIntegrityState(state));
    this.userService.getUserInfo().then(console.log);
  }

  checkIntegrityState(state: AppState) {
    console.log(state.props);
    if(state.props.wallets.length === 0) {
      this.router.navigate(['/create-wallet', 'wallet-name'])
    }
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

import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {AuthService} from "./auth/auth.service";
import { states } from './states/app-state';
import {refreshWallets} from "./shared/helpers";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean | UrlTree> {
    if(states.wallets.val.wallets.length === 0) {
      await refreshWallets();
    }
    if(!(await this.authService.checkIfAuthenticated())) {
      this.router.navigate(['/auth']);
    }
    return true;
  }

}

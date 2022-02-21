import {AfterViewInit, Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {AntiMemLeak} from "../../shared/anti-mem-leak";
import {AuthService} from "../../auth/auth.service";
import {UserService} from "../../shared/user.service";
import {refreshWallets} from "../../shared/helpers";
import { ModalService } from 'src/app/modal.service';
import { states } from 'src/app/states/app-state';
import {WalletStateProps} from "../../states/wallets-state";


@Component({
  selector: 'app-wallet-layout',
  templateUrl: './wallet-layout.component.html',
  styleUrls: ['./wallet-layout.component.scss']
})
export class WalletLayoutComponent extends AntiMemLeak implements OnInit, AfterViewInit {
  endpoint: string | undefined;
  @ViewChild('setExchangeKeys') setCredentials: TemplateRef<any> | undefined;
  @ViewChild('addToBlacklist') addToBlacklist: TemplateRef<any> | undefined;
  @ViewChild('deleteBlacklistSymbol') deleteBlacklistSymbol: TemplateRef<any> | undefined;

  modalsRoutes: {[key: string]: TemplateRef<any> | undefined} = {};
  currentModal: TemplateRef<any> | undefined;

  constructor(
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private userService: UserService,
    private router: Router,
    private modalService: ModalService
  ) {
    super();
  }

  ngAfterViewInit(): void {
    this.modalsRoutes = {
      setCredentials: this.setCredentials,
      addToBlacklist: this.addToBlacklist,
      deleteBlacklistSymbol: this.deleteBlacklistSymbol
    }
    this.endpoint = this.router.url.split('?')[0].split('/').splice(-1)[0];
    this.sub.add(
      this.router.events.subscribe(() => {
        this.endpoint = this.router.url.split('/').splice(-1)[0];
        console.log(this.endpoint);
        this.currentModal = this.modalsRoutes[this.activatedRoute.snapshot.queryParams['modal']];
      })
    );
  }

  async ngOnInit(): Promise<void> {
    await refreshWallets();
    this.sub.add(
      states.wallets.obs.subscribe((state) => this.checkIntegrityState(state))
    );
    this.userService.getUserInfo().then(user => {
      states.user.set(user);
    });
    if(this.activatedRoute.snapshot.queryParams['modal']) {
      this.currentModal = this.modalsRoutes[this.activatedRoute.snapshot.queryParams['modal']];
    }
  }

  checkIntegrityState(state: WalletStateProps) {
    if(state?.wallets?.length === 0) {
      this.router.navigate(['/create-wallet', 'wallet-name'])
    }
  }

  async refreshSymbols(): Promise<void> {
    states.exchange.getClient()?.getExchangeInfo()
  }

  liClass(liId: string) {
    const route = this.router.url.split('/')[1];
    return route === liId ? 'active' : '';
  }

  closeModal() {
    this.modalService.closeModal();
  }

  async logout() {
    this.authService.logout();
    location.reload();
  }

}

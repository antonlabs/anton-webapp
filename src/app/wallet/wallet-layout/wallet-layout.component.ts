import {AfterViewInit, Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {AntiMemLeak} from "../../shared/anti-mem-leak";
import {AuthService} from "../../auth/auth.service";
import {UserService} from "../../shared/user.service";
import {refreshWallets} from "../../shared/helpers";
import { ModalService } from 'src/app/modal.service';
import {rack} from 'src/app/states/app-state';
import {WalletStateProps} from "../../states/wallets-state";
import {NotificationService} from "../../shared/notification.service";
import {getRightMarginFromElement} from "../../core/elements-helper";


@Component({
  selector: 'app-wallet-layout',
  templateUrl: './wallet-layout.component.html',
  styleUrls: ['./wallet-layout.component.scss']
})
export class WalletLayoutComponent extends AntiMemLeak implements OnInit, AfterViewInit {
  endpoint: string | undefined;
  @ViewChild('setExchangeKeys') setCredentials: TemplateRef<any> | undefined;
  @ViewChild('addToBlacklist') addToBlacklist: TemplateRef<any> | undefined;
  @ViewChild('inspectOrder') inspectOrder: TemplateRef<any> | undefined;
  @ViewChild('deleteBlacklistSymbol') deleteBlacklistSymbol: TemplateRef<any> | undefined;

  modalsRoutes: {[key: string]: TemplateRef<any> | undefined} = {};
  currentModal: TemplateRef<any> | undefined;
  currentDialog: string | undefined;
  currentTimeout: any;
  ordersInterval: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private userService: UserService,
    private router: Router,
    private notificationService: NotificationService,
    private modalService: ModalService
  ) {
    super();
  }

  ngAfterViewInit(): void {
    this.modalsRoutes = {
      setCredentials: this.setCredentials,
      addToBlacklist: this.addToBlacklist,
      inspectOrder: this.inspectOrder,
      deleteBlacklistSymbol: this.deleteBlacklistSymbol
    };
    this.endpoint = this.router.url.split('?')[0].split('/').splice(-1)[0];
    this.sub.add(
      this.router.events.subscribe(() => {
        this.endpoint = this.router.url.split('?')[0].split('/').splice(-1)[0];
        this.currentModal = this.modalsRoutes[this.activatedRoute.snapshot.queryParams['modal']];
        this.currentDialog = this.activatedRoute.snapshot.queryParams['dialog'];
        if(this.currentDialog) {
          this.handleDialogTimeout();
        }
      })
    );
  }

  getDropdownStyle(element: HTMLAnchorElement): {[key: string]: string} {
    const result: any = {};
    const margin = getRightMarginFromElement(element);
    if(margin < 80) {
      result['transform'] = `translateY(30px) translateX(-80%)`
    }
    return result;
  }

  async ngOnInit(): Promise<void> {
    await refreshWallets();
    this.sub.add(
      rack.states.wallets.obs.subscribe((state) => this.checkIntegrityState(state))
    );
    this.userService.getUserInfo().then(user => {
      rack.states.user.set(user);
    });
    if(this.activatedRoute.snapshot.queryParams['modal']) {
      this.currentModal = this.modalsRoutes[this.activatedRoute.snapshot.queryParams['modal']];
    }
    if(this.activatedRoute.snapshot.queryParams['dialog']) {
      this.currentDialog = this.activatedRoute.snapshot.queryParams['dialog'];
      this.handleDialogTimeout();
    }
  }

  handleDialogTimeout() {
    if (this.currentTimeout) {
      clearTimeout(this.currentTimeout);
      this.currentTimeout = undefined;
    }
    this.currentTimeout = setTimeout(() => {
      this.notificationService.closeNotification();
      clearTimeout(this.currentTimeout);
    }, 5000);
  }

  checkIntegrityState(state: WalletStateProps) {
    if(state?.wallets?.length === 0) {
      this.router.navigate(['/create-wallet'])
    }
  }

  async refreshSymbols(): Promise<void> {
    rack.states.exchange.getClient()?.getExchangeInfo()
  }

  liClass(liId: string) {
    const route = this.router.url.split('?')[0].split('/')[1];
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

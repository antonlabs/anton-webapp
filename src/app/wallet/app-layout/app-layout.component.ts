import {AfterViewInit, Component, EventEmitter, HostListener, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {AntiMemLeak} from "../../shared/anti-mem-leak";
import {AuthService} from "../../auth/auth.service";
import {UserService} from "../../shared/user.service";
import {NotificationService} from "../../shared/notification.service";
import {getTransactions, refreshWallets} from "../../shared/helpers";
import {rack} from "../../states/app-state";
import {WalletStateProps} from "../../states/wallets-state";
import {getRightMarginFromElement} from "../../core/elements-helper";
import {ModalService} from "../../modal.service";
import {TransactionModel} from "../../core/clients/models/transaction.model";

export const scrollPosition = new EventEmitter();


@Component({
  selector: 'app-app-layout',
  templateUrl: './app-layout.component.html',
  styleUrls: ['./app-layout.component.scss']
})
export class AppLayoutComponent extends AntiMemLeak implements OnInit, AfterViewInit {
  endpoint: string | undefined;
  @ViewChild('setExchangeKeys') setCredentials: TemplateRef<any> | undefined;
  @ViewChild('inspectOrder') inspectOrder: TemplateRef<any> | undefined;
  @ViewChild('runStrategyDescription') runStrategyDescription: TemplateRef<any> | undefined;
  @ViewChild('deleteBlacklistSymbol') deleteBlacklistSymbol: TemplateRef<any> | undefined;
  @ViewChild('resetDialog') resetDialog: TemplateRef<any> | undefined;

  modalsRoutes: {[key: string]: TemplateRef<any> | undefined} = {};
  currentModal: TemplateRef<any> | undefined;
  currentDialog: string | undefined;
  currentTimeout: any;
  ordersInterval: any;
  closedTransactions: TransactionModel[] = [];

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

  async loadStates() {
    await refreshWallets();
    await Promise.all([
      rack.states.currentWallet.refreshState(),
      rack.states.market.refreshState()
    ]);
  }


  ngAfterViewInit(): void {
    this.modalsRoutes = {
      setCredentials: this.setCredentials,
      inspectOrder: this.inspectOrder,
      resetDialog: this.resetDialog,
      runStrategyDescription: this.runStrategyDescription,
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
    await this.loadStates();
    getTransactions('CLOSE').then(transactions => {
      this.closedTransactions = transactions.data.filter(o => o.earnings !== undefined);
    });
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

  slice(elements: any[]) {
    return elements.slice(0, 10);
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

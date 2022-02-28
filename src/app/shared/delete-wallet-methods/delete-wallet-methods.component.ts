import { Component, OnInit } from '@angular/core';
import {DeleteWalletMethod, WalletService} from "../wallet.service";
import {ActivatedRoute, Router} from "@angular/router";
import {AntiMemLeak} from "../anti-mem-leak";
import {ModalService} from "../../modal.service";

@Component({
  selector: 'app-delete-wallet-methods',
  templateUrl: './delete-wallet-methods.component.html',
  styleUrls: ['./delete-wallet-methods.component.scss']
})
export class DeleteWalletMethodsComponent extends AntiMemLeak implements OnInit {

  walletName: string | undefined;
  loading = false;
  error: string | undefined;

  constructor(
    private walletService: WalletService,
    private modalService: ModalService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    super();
  }

  ngOnInit(): void {
    this.sub.add(
      this.activatedRoute.queryParams.subscribe(queryParams => {
        this.walletName = queryParams['wallet'];
      })
    );
  }

  async deleteWallet(method: DeleteWalletMethod) {
    if(this.walletName) {
      this.loading = true;
      try{
        await this.walletService.deleteWallet(this.walletName, method);
        this.modalService.closeModal();
      }catch (e) {
        this.error = $localize`Ops...something went wrong during delete, contact support or retry later`;
      }finally {
        this.loading = false;
      }
    }
  }

  goBack() {
    this.router.navigate(['/overview'])
  }

}

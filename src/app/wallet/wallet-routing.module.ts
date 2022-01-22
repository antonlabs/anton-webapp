import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {WalletLayoutComponent} from "./wallet-layout/wallet-layout.component";

const routes: Routes = [
  {
    path: '',
    component: WalletLayoutComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WalletRoutingModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {WalletNameComponent} from "./wallet-name/wallet-name.component";

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'wallet-name'
  },
  {
    path: 'wallet-name',
    component: WalletNameComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FirstWalletCreationRoutingModule { }

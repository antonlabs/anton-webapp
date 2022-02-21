import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {WalletOrdersComponent} from "./wallet-orders.component";

const routes: Routes = [
  {
    path: '',
    component: WalletOrdersComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule]
})
export class OrdersRoutingModule { }

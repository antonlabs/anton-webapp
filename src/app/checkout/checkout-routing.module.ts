import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {CheckoutSuccessComponent} from "./checkout-success/checkout-success.component";
import {CheckoutCancelComponent} from "./checkout-cancel/checkout-cancel.component";

const routes: Routes = [
  {
    path: 'success',
    component: CheckoutSuccessComponent
  },
  {
    path: 'cancel',
    component: CheckoutCancelComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CheckoutRoutingModule { }

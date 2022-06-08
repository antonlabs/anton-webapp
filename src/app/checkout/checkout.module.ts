import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CheckoutRoutingModule } from './checkout-routing.module';
import { CheckoutSuccessComponent } from './checkout-success/checkout-success.component';
import { CheckoutCancelComponent } from './checkout-cancel/checkout-cancel.component';


@NgModule({
  declarations: [
  
    CheckoutSuccessComponent,
       CheckoutCancelComponent
  ],
  imports: [
    CommonModule,
    CheckoutRoutingModule
  ]
})
export class CheckoutModule { }

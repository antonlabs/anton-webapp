import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {WalletOrdersComponent} from "./wallet-orders/wallet-orders.component";
import { OrdersRoutingModule } from './wallet-orders/orders-routing.module';
import {SharedModule} from "../../shared/shared.module";
import { OrderInspectionComponent } from './order-inspection/order-inspection.component';



@NgModule({
  declarations: [
    WalletOrdersComponent,
    OrderInspectionComponent
  ],
  imports: [
    CommonModule,
    OrdersRoutingModule,
    SharedModule
  ]
})
export class OrdersModule { }

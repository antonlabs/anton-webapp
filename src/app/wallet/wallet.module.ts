import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WalletRoutingModule } from './wallet-routing.module';
import { WalletLayoutComponent } from './wallet-layout/wallet-layout.component';
import { WalletOverviewComponent } from './wallet-overview/wallet-overview.component';
import {SharedModule} from "../shared/shared.module";
import {ReactiveFormsModule} from "@angular/forms";
import {NgIconsModule} from "@ng-icons/core";


@NgModule({
  declarations: [
    WalletLayoutComponent,
    WalletOverviewComponent
  ],
    imports: [
        CommonModule,
        WalletRoutingModule,
        SharedModule,
        ReactiveFormsModule,
        NgIconsModule
    ]
})
export class WalletModule { }

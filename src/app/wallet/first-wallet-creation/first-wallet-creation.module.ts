import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FirstWalletCreationRoutingModule } from './first-wallet-creation-routing.module';
import { WalletNameComponent } from './wallet-name/wallet-name.component';
import {ReactiveFormsModule} from "@angular/forms";
import {SharedModule} from "../../shared/shared.module";
import { ConfigureWalletComponent } from './configure-wallet/configure-wallet.component';
import { WalletPlatformComponent } from './wallet-platform/wallet-platform.component';
import {WalletModule} from "../wallet.module";


@NgModule({
  declarations: [
    WalletNameComponent,
    ConfigureWalletComponent,
    WalletPlatformComponent
  ],
    imports: [
        CommonModule,
        FirstWalletCreationRoutingModule,
        ReactiveFormsModule,
        SharedModule,
        WalletModule
    ]
})
export class FirstWalletCreationModule { }

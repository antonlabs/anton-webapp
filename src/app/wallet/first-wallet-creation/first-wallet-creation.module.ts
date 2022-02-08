import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FirstWalletCreationRoutingModule } from './first-wallet-creation-routing.module';
import { WalletNameComponent } from './wallet-name/wallet-name.component';
import {ReactiveFormsModule} from "@angular/forms";


@NgModule({
  declarations: [
    WalletNameComponent
  ],
  imports: [
    CommonModule,
    FirstWalletCreationRoutingModule,
    ReactiveFormsModule
  ]
})
export class FirstWalletCreationModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingsRoutingModule } from './settings-routing.module';
import { SettingsOverviewComponent } from './settings-overview/settings-overview.component';
import {SharedModule} from "../shared/shared.module";
import {NgIconsModule} from "@ng-icons/core";
import {WalletModule} from "../wallet/wallet.module";


@NgModule({
  declarations: [
    SettingsOverviewComponent
  ],
  imports: [
    CommonModule,
    SettingsRoutingModule,
    SharedModule,
    NgIconsModule,
    WalletModule
  ]
})
export class SettingsModule { }

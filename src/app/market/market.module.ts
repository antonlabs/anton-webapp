import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MarketRoutingModule } from './market-routing.module';
import { MarketOverviewComponent } from './market-overview/market-overview.component';
import {SharedModule} from "../shared/shared.module";


@NgModule({
  declarations: [
    MarketOverviewComponent
  ],
    imports: [
        CommonModule,
        MarketRoutingModule,
        SharedModule
    ]
})
export class MarketModule { }

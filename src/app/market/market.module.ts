import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MarketRoutingModule } from './market-routing.module';
import { MarketOverviewComponent } from './market-overview/market-overview.component';
import {SharedModule} from "../shared/shared.module";
import { SymbolAnalysisComponent } from './symbol-analysis/symbol-analysis.component';


@NgModule({
  declarations: [
    MarketOverviewComponent,
    SymbolAnalysisComponent
  ],
    imports: [
        CommonModule,
        MarketRoutingModule,
        SharedModule
    ]
})
export class MarketModule { }

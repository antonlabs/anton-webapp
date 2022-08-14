import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {MarketOverviewComponent} from "./market-overview/market-overview.component";
import {SymbolAnalysisComponent} from "./symbol-analysis/symbol-analysis.component";

const routes: Routes = [
  {
    path: '',
    component: MarketOverviewComponent
  },
  {
    path: ':symbolId',
    component: SymbolAnalysisComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MarketRoutingModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {MarketOverviewComponent} from "./market-overview/market-overview.component";

const routes: Routes = [
  {
    path: '',
    component: MarketOverviewComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MarketRoutingModule { }

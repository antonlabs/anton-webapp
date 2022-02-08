import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {WalletLayoutComponent} from "./wallet-layout/wallet-layout.component";
import {WalletOverviewComponent} from "./wallet-overview/wallet-overview.component";

const routes: Routes = [
  {
    path: 'first-access',
    loadChildren: () => import('./first-wallet-creation/first-wallet-creation.module').then(m => m.FirstWalletCreationModule)
  },
  {
    path: '',
    component: WalletLayoutComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'overview'
      },
      {
        path: 'overview',
        component: WalletOverviewComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WalletRoutingModule { }

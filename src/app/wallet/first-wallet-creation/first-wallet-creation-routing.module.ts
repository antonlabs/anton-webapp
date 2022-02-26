import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {WalletNameComponent} from "./wallet-name/wallet-name.component";
import {ConnectWalletComponent} from "../connect-wallet/connect-wallet.component";
import { ConfigureWalletComponent } from './configure-wallet/configure-wallet.component';
import { WalletPlatformComponent } from './wallet-platform/wallet-platform.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'wallet-platform'
  },
  /*{
    path: 'wallet-name',
    component: WalletNameComponent,
    data: {
      stepper: 'create-wallet-name'
    }
  },*/
  {
    path: 'wallet-platform',
    component: WalletPlatformComponent,
    data: {
      stepper: 'wallet-platform'
    }
  },
  {
    path: 'connect',
    component: ConnectWalletComponent,
    data: {
      stepper: 'create-wallet-keys'
    }
  },
  {
    path: 'wallet-configuration',
    component: ConfigureWalletComponent,
    data: {
      stepper: 'wallet-configuration'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FirstWalletCreationRoutingModule { }

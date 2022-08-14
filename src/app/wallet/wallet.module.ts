import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WalletRoutingModule } from './wallet-routing.module';
import { WalletOverviewComponent } from './wallet-overview/wallet-overview.component';
import {SharedModule} from "../shared/shared.module";
import {ReactiveFormsModule} from "@angular/forms";
import {NgIconsModule} from "@ng-icons/core";
import { ConnectWalletComponent } from './connect-wallet/connect-wallet.component';
import { WalletCreateLayoutComponent } from './wallet-create-layout/wallet-create-layout.component';
import { DeleteBlacklistSymbolComponent } from './delete-blacklist-symbol/delete-blacklist-symbol.component';
import {OrdersModule} from "./orders/orders.module";
import { TransactionDetailsModalComponent } from './transaction-details-modal/transaction-details-modal.component';
import { RunStrategyDescriptionComponent } from './run-strategy-description/run-strategy-description.component';
import { ResetDialogComponent } from './reset-dialog/reset-dialog.component';
import {AppLayoutComponent} from "./app-layout/app-layout.component";
import { PortfolioCardComponent } from './portfolio-card/portfolio-card.component';


@NgModule({
    declarations: [
        WalletOverviewComponent,
        ConnectWalletComponent,
        WalletCreateLayoutComponent,
        DeleteBlacklistSymbolComponent,
        TransactionDetailsModalComponent,
        RunStrategyDescriptionComponent,
        ResetDialogComponent,
        AppLayoutComponent,
        PortfolioCardComponent
    ],
    exports: [
        ConnectWalletComponent
    ],
    imports: [
        CommonModule,
        WalletRoutingModule,
        SharedModule,
        ReactiveFormsModule,
        NgIconsModule,
        OrdersModule
    ]
})
export class WalletModule { }

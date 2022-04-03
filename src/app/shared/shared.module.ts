import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {LogoComponent} from "./logo/logo.component";
import { AntonChartComponent } from './anton-chart/anton-chart.component';
import { SpinnerComponent } from './spinner/spinner.component';
import { ButtonComponent } from './button/button.component';
import { StepperComponent } from './stepper/stepper.component';
import { SliderComponent } from './slider/slider.component';
import {ReactiveFormsModule} from "@angular/forms";
import { CashInputComponent } from './cash-input/cash-input.component';
import { AvatarComponent } from './avatar/avatar.component';
import { CounterComponent } from './counter/counter.component';
import {NgIconsModule} from "@ng-icons/core";
import { SwitchComponent } from './switch/switch.component';
import { OrderCardComponent } from './order-card/order-card.component';
import { SymbolCardComponent } from './symbol-card/symbol-card.component';
import { SymbolsListComponent } from './symbols-list/symbols-list.component';
import { FooterComponent } from './footer/footer.component';
import { WalletSettingsComponent } from './wallet-settings/wallet-settings.component';
import { DeleteWalletMethodsComponent } from './delete-wallet-methods/delete-wallet-methods.component';
import { OrderChartComponent } from './order-chart/order-chart.component';
import {RouterModule} from "@angular/router";
import { TransactionCardComponent } from './transaction-card/transaction-card.component';
import { RevenuesChartComponent } from './revenues-chart/revenues-chart.component';
import { BalancesChartComponent } from './balances-chart/balances-chart.component';
import { LanguageSelectorComponent } from './language-selector/language-selector.component';



@NgModule({
  declarations: [
    LogoComponent,
    AntonChartComponent,
    SpinnerComponent,
    ButtonComponent,
    StepperComponent,
    SliderComponent,
    CashInputComponent,
    AvatarComponent,
    CounterComponent,
    SwitchComponent,
    OrderCardComponent,
    SymbolCardComponent,
    SymbolsListComponent,
    FooterComponent,
    WalletSettingsComponent,
    DeleteWalletMethodsComponent,
    OrderChartComponent,
    TransactionCardComponent,
    RevenuesChartComponent,
    BalancesChartComponent,
    LanguageSelectorComponent
  ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        NgIconsModule,
        RouterModule
    ],
    exports: [
        LogoComponent,
        AntonChartComponent,
        SpinnerComponent,
        ButtonComponent,
        StepperComponent,
        SliderComponent,
        BalancesChartComponent,
        CashInputComponent,
        AvatarComponent,
        CounterComponent,
        SwitchComponent,
        OrderCardComponent,
        SymbolCardComponent,
        SymbolsListComponent,
        FooterComponent,
        WalletSettingsComponent,
        DeleteWalletMethodsComponent,
        OrderChartComponent,
        TransactionCardComponent,
        RevenuesChartComponent,
        LanguageSelectorComponent
    ]
})
export class SharedModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {LogoComponent} from "./logo/logo.component";
import { AntonChartComponent } from './anton-chart/anton-chart.component';
import { SpinnerComponent } from './spinner/spinner.component';
import { ButtonComponent } from './button/button.component';



@NgModule({
  declarations: [
    LogoComponent,
    AntonChartComponent,
    SpinnerComponent,
    ButtonComponent
  ],
  imports: [
    CommonModule
  ],
    exports: [
        LogoComponent,
        AntonChartComponent,
        SpinnerComponent,
        ButtonComponent
    ]
})
export class SharedModule { }

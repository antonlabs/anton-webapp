import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {LogoComponent} from "./logo/logo.component";
import { AntonChartComponent } from './anton-chart/anton-chart.component';
import { SpinnerComponent } from './spinner/spinner.component';



@NgModule({
  declarations: [
    LogoComponent,
    AntonChartComponent,
    SpinnerComponent
  ],
  imports: [
    CommonModule
  ],
    exports: [
        LogoComponent,
        AntonChartComponent,
        SpinnerComponent
    ]
})
export class SharedModule { }

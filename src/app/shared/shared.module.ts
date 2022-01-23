import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {LogoComponent} from "./logo/logo.component";
import { AntonChartComponent } from './anton-chart/anton-chart.component';



@NgModule({
  declarations: [
    LogoComponent,
    AntonChartComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    LogoComponent,
    AntonChartComponent
  ]
})
export class SharedModule { }

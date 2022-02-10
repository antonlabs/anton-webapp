import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {LogoComponent} from "./logo/logo.component";
import { AntonChartComponent } from './anton-chart/anton-chart.component';
import { SpinnerComponent } from './spinner/spinner.component';
import { ButtonComponent } from './button/button.component';
import { StepperComponent } from './stepper/stepper.component';
import { SliderComponent } from './slider/slider.component';
import {ReactiveFormsModule} from "@angular/forms";



@NgModule({
  declarations: [
    LogoComponent,
    AntonChartComponent,
    SpinnerComponent,
    ButtonComponent,
    StepperComponent,
    SliderComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
    exports: [
        LogoComponent,
        AntonChartComponent,
        SpinnerComponent,
        ButtonComponent,
        StepperComponent,
        SliderComponent
    ]
})
export class SharedModule { }

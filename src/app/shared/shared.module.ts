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
    SwitchComponent
  ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        NgIconsModule
    ],
  exports: [
    LogoComponent,
    AntonChartComponent,
    SpinnerComponent,
    ButtonComponent,
    StepperComponent,
    SliderComponent,
    CashInputComponent,
    AvatarComponent,
    CounterComponent,
    SwitchComponent
  ]
})
export class SharedModule { }

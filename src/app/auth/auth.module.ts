import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './login/login.component';
import { AuthLayoutComponent } from './auth-layout/auth-layout.component';
import {SharedModule} from "../shared/shared.module";
import { AuthMethodsComponent } from './auth-methods/auth-methods.component';
import { EmailLoginComponent } from './login/email-login/email-login.component';
import { TelegramLoginComponent } from './login/telegram-login/telegram-login.component';
import { PhoneLoginComponent } from './login/phone-login/phone-login.component';


@NgModule({
  declarations: [
    LoginComponent,
    AuthLayoutComponent,
    AuthMethodsComponent,
    EmailLoginComponent,
    TelegramLoginComponent,
    PhoneLoginComponent
  ],
  imports: [
    SharedModule,
    CommonModule,
    AuthRoutingModule
  ]
})
export class AuthModule { }

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
import {NgIconsModule} from "@ng-icons/core";
import { SendRecoveryMailComponent } from './challenges/send-recovery-mail/send-recovery-mail.component';
import { RecoveryPasswordFallbackComponent } from './challenges/recovery-password-fallback/recovery-password-fallback.component';
import { MfaRequiredComponent } from './challenges/mfa-required/mfa-required.component';
import {ReactiveFormsModule} from "@angular/forms";


@NgModule({
  declarations: [
    LoginComponent,
    AuthLayoutComponent,
    AuthMethodsComponent,
    EmailLoginComponent,
    TelegramLoginComponent,
    PhoneLoginComponent,
    SendRecoveryMailComponent,
    RecoveryPasswordFallbackComponent,
    MfaRequiredComponent
  ],
  imports: [
    SharedModule,
    CommonModule,
    AuthRoutingModule,
    NgIconsModule,
    ReactiveFormsModule
  ]
})
export class AuthModule { }

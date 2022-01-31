import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './login/login.component';
import { AuthLayoutComponent } from './auth-layout/auth-layout.component';
import {SharedModule} from "../shared/shared.module";
import { AuthMethodsComponent } from './auth-methods/auth-methods.component';
import {NgIconsModule} from "@ng-icons/core";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {RECAPTCHA_V3_SITE_KEY, RecaptchaV3Module} from "ng-recaptcha";
import {RegisterComponent} from './register/register.component';
import {EmailLoginComponent} from './email-login/email-login.component';
import {VerifyFallbackComponent} from './verify-fallback/verify-fallback.component';
import {SendRecoveryMailComponent} from "./send-recovery-mail/send-recovery-mail.component";


@NgModule({
  declarations: [
    LoginComponent,
    AuthLayoutComponent,
    AuthMethodsComponent,
    EmailLoginComponent,
    SendRecoveryMailComponent,
    RegisterComponent,
    VerifyFallbackComponent
  ],
  imports: [
    SharedModule,
    CommonModule,
    RecaptchaV3Module,
    AuthRoutingModule,
    NgIconsModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [
    { provide: RECAPTCHA_V3_SITE_KEY, useValue: "6Ldd2RQeAAAAABidUe7PPYzpYUnwIa599ZatjTf_" }
  ]
})
export class AuthModule { }


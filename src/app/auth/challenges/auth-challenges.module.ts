import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {NgIconsModule} from "@ng-icons/core";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {RECAPTCHA_V3_SITE_KEY, RecaptchaV3Module} from "ng-recaptcha";
import { NewPasswordRequiredComponent } from './new-password-required/new-password-required.component';
import { RecoveryPasswordFallbackComponent } from './recovery-password-fallback/recovery-password-fallback.component';
import {SharedModule} from "../../shared/shared.module";
import { AuthChallengesRoutingModule } from './auth-challenges-routing.module';
import { MfaSetupComponent } from './mfa-setup/mfa-setup.component';
import { environment } from "../../../environments/environment";


@NgModule({
  declarations: [
    RecoveryPasswordFallbackComponent,
    NewPasswordRequiredComponent,
    MfaSetupComponent
  ],
  imports: [
    SharedModule,
    CommonModule,
    RecaptchaV3Module,
    NgIconsModule,
    AuthChallengesRoutingModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [
    { provide: RECAPTCHA_V3_SITE_KEY, useValue: environment.recaptchaV3SiteKey }
  ]
})
export class AuthChallengesModule { }


import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AuthLayoutComponent} from "./auth-layout/auth-layout.component";
import {LoginComponent} from "./login/login.component";
import {EmailLoginComponent} from "./login/email-login/email-login.component";
import {TelegramLoginComponent} from "./login/telegram-login/telegram-login.component";
import {PhoneLoginComponent} from "./login/phone-login/phone-login.component";
import {SendRecoveryMailComponent} from "./challenges/send-recovery-mail/send-recovery-mail.component";
import {
  RecoveryPasswordFallbackComponent
} from "./challenges/recovery-password-fallback/recovery-password-fallback.component";

const routes: Routes = [
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      {
        path: 'recover',
        component: SendRecoveryMailComponent
      },
      {
        path: 'recover-fallback',
        component: RecoveryPasswordFallbackComponent
      },
      {
        path: '',
        component: LoginComponent,
        children: [
          {
            path: '',
            pathMatch: 'full',
            redirectTo: 'email'
          },
          {
            path: 'email',
            component: EmailLoginComponent
          },
          {
            path: 'telegram',
            component: TelegramLoginComponent
          },
          {
            path: 'phone',
            component: PhoneLoginComponent
          }
        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }

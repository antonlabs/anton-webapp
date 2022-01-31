import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AuthLayoutComponent} from "./auth-layout/auth-layout.component";
import {LoginComponent} from "./login/login.component";
import {
  RecoveryPasswordFallbackComponent
} from "./challenges/recovery-password-fallback/recovery-password-fallback.component";
import {RegisterComponent} from "./register/register.component";
import {EmailLoginComponent} from "./email-login/email-login.component";
import {VerifyFallbackComponent} from "./verify-fallback/verify-fallback.component";

const routes: Routes = [
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      {
        path: 'recover-fallback',
        component: RecoveryPasswordFallbackComponent
      },
      {
        path: 'verify-fallback',
        component: VerifyFallbackComponent
      },
      {
        path: 'challenges',
        loadChildren: () => import('./challenges/auth-challenges.module').then((m) => m.AuthChallengesModule)
      },
      {
        path: 'register',
        component: RegisterComponent,
        children: [
          {
            path: '',
            pathMatch: 'full',
            redirectTo: 'email'
          },
          {
            path: 'email',
            data: {
              buttonString: 'Register'
            },
            component: EmailLoginComponent
          }
        ]
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
            data: {
              buttonString: 'Login'
            },
            component: EmailLoginComponent
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

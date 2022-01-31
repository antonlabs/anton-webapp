import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {NewPasswordRequiredComponent} from "./new-password-required/new-password-required.component";
import {MfaSetupComponent} from "./mfa-setup/mfa-setup.component";

const routes: Routes = [
  {
    path: 'mfa_setup',
    component: MfaSetupComponent
  },
  {
    path: 'new_password_required',
    component: NewPasswordRequiredComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthChallengesRoutingModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ProfileOverviewComponent} from "./profile-overview/profile-overview.component";

const routes: Routes = [{
  path: '',
  component: ProfileOverviewComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileRoutingModule { }

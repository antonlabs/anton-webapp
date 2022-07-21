import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileOverviewComponent } from './profile-overview/profile-overview.component';
import {SharedModule} from "../shared/shared.module";
import { ProfileLayoutComponent } from './profile-layout/profile-layout.component';
import {NgIconsModule} from "@ng-icons/core";
import {ReactiveFormsModule} from "@angular/forms";


@NgModule({
  declarations: [
    ProfileOverviewComponent,
    ProfileLayoutComponent
  ],
    imports: [
        CommonModule,
        ProfileRoutingModule,
        SharedModule,
        NgIconsModule,
        ReactiveFormsModule
    ]
})
export class ProfileModule { }

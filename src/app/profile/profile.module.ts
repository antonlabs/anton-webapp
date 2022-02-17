import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileOverviewComponent } from './profile-overview/profile-overview.component';
import {ImageCropperModule} from "ngx-image-cropper";
import {SharedModule} from "../shared/shared.module";
import { ProfileLayoutComponent } from './profile-layout/profile-layout.component';
import {NgIconsModule} from "@ng-icons/core";


@NgModule({
  declarations: [
    ProfileOverviewComponent,
    ProfileLayoutComponent
  ],
  imports: [
    CommonModule,
    ImageCropperModule,
    ProfileRoutingModule,
    SharedModule,
    NgIconsModule
  ]
})
export class ProfileModule { }

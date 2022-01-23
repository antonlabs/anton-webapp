import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgIconsModule } from '@ng-icons/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {MatTelegram} from '@ng-icons/material-icons';
import {JamArrowCircleLeftF} from '@ng-icons/jam-icons';



@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
      BrowserModule,
      NgIconsModule.withIcons({MatTelegram, JamArrowCircleLeftF}),
      AppRoutingModule
    ],
    providers: [],
    exports: [
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }

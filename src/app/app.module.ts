import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgIconsModule } from '@ng-icons/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {MatCurrencyExchange, MatLink, MatLinkOff, MatTelegram} from '@ng-icons/material-icons';
import {JamArrowCircleLeftF, JamBell, JamClose, JamCoin, JamPlusCircleF, JamUserCircle} from '@ng-icons/jam-icons';
import { HttpClientModule } from '@angular/common/http';



@NgModule({
    declarations: [
      AppComponent
    ],
    imports: [
      BrowserModule,
      HttpClientModule,
      NgIconsModule.withIcons({
        MatTelegram,
        JamArrowCircleLeftF,
        JamUserCircle,
        MatCurrencyExchange,
        MatLinkOff,
        JamClose,
        MatLink,
        JamPlusCircleF,
        JamBell,
        JamCoin
      }),
      AppRoutingModule
    ],
    providers: [],
    exports: [],
    bootstrap: [AppComponent]
})
export class AppModule { }

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgIconsModule } from '@ng-icons/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {MatCurrencyExchange, MatLink, MatLinkOff, MatTelegram} from '@ng-icons/material-icons';
import {
  JamArrowCircleDownF,
  JamArrowCircleLeftF,
  JamArrowCircleRightF, JamArrowUp,
  JamBell,
  JamClose, JamCogs,
  JamCoin, JamFacebookCircle, JamGithubCircle, JamInstagram,
  JamPause,
  JamPencil,
  JamPlay,
  JamPlusCircleF, JamTwitterCircle,
  JamUserCircle
} from '@ng-icons/jam-icons';
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
        JamArrowCircleDownF,
        JamArrowCircleRightF,
        JamUserCircle,
        MatCurrencyExchange,
        JamPause,
        JamPlay,
        MatLinkOff,
        JamClose,
        JamArrowUp,
        JamInstagram,
        JamTwitterCircle,
        JamGithubCircle,
        JamCogs,
        JamFacebookCircle,
        JamPencil,
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

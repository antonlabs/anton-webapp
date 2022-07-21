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
  JamCoin, JamCrown, JamFacebookCircle, JamGithubCircle, JamHomeF, JamInstagram,
  JamPause,
  JamPencil,
  JamPlay, JamPlus,
  JamPlusCircleF, JamSearch, JamTwitterCircle,
  JamUserCircle
} from '@ng-icons/jam-icons';
import { HttpClientModule } from '@angular/common/http';
import {SharedModule} from "./shared/shared.module";



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
            JamHomeF,
            JamArrowCircleRightF,
            JamUserCircle,
            MatCurrencyExchange,
            JamPause,
            JamPlay,
            MatLinkOff,
            JamClose,
            JamCrown,
          JamPlus,
            JamArrowUp,
            JamInstagram,
            JamTwitterCircle,
            JamGithubCircle,
            JamCogs,
            JamFacebookCircle,
            JamPencil,
            MatLink,
            JamSearch,
            JamPlusCircleF,
            JamBell,
            JamCoin
        }),
        AppRoutingModule,
        SharedModule
    ],
    providers: [],
    exports: [],
    bootstrap: [AppComponent]
})
export class AppModule { }

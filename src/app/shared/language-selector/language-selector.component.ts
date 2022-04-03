import { Component, OnInit } from '@angular/core';
import {rack} from "../../states/app-state";
import {Router} from "@angular/router";

@Component({
  selector: 'app-language-selector',
  templateUrl: './language-selector.component.html',
  styleUrls: ['./language-selector.component.scss']
})
export class LanguageSelectorComponent implements OnInit {

  currentLang: 'it' | 'en' = rack.states.user.val.lang;

  constructor(private router: Router) { }

  ngOnInit(): void {
    rack.states.user.obs.subscribe(user => {
      if(this.currentLang !== user.lang) {
        this.currentLang = user.lang;
        location.href = '/'+user.lang
      }
    })
  }

  switchLang(lang: 'it' | 'en') {
    rack.states.user.set({
      lang: lang
    });
  }

}

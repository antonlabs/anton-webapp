import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-language-selector',
  templateUrl: './language-selector.component.html',
  styleUrls: ['./language-selector.component.scss']
})
export class LanguageSelectorComponent implements OnInit {

  currentLang: 'it' | 'en' = location.pathname.split('/')[1] as any;

  constructor() { }

  ngOnInit(): void {
  }

}

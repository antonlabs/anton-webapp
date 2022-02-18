import { Component, Input, OnInit } from '@angular/core';
import {cryptoMap} from "../../crypto-map";

@Component({
  selector: 'app-symbol-card',
  templateUrl: './symbol-card.component.html',
  styleUrls: ['./symbol-card.component.scss']
})
export class SymbolCardComponent implements OnInit {
  _symbol: string | undefined;
  imgSrc: string | undefined;

  @Input()
  set symbol(val: string | undefined) {
    this._symbol = val;
    if(val) {
      this.imgSrc = `https://cryptologos.cc/logos/${cryptoMap[val] ?? ''}-${val.toLowerCase()}-logo.svg`;
    }
  }

  @Input() market: string | undefined;


  constructor() { }

  ngOnInit(): void {
  }



}

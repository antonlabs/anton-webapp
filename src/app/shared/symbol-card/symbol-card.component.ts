import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {cryptoMap} from "../../crypto-map";

@Component({
  selector: 'app-symbol-card',
  templateUrl: './symbol-card.component.html',
  styleUrls: ['./symbol-card.component.scss']
})
export class SymbolCardComponent implements OnInit {
  _symbol: string | undefined;
  market: string | undefined;
  imgSrc: string | undefined;

  @Input() remove = true;
  @Input() selectable = true;

  @Input()
  set symbol(val: string | undefined) {
    if(val) {
      this._symbol = val.split('-')[0];
      this.imgSrc = `https://cryptologos.cc/logos/${cryptoMap[this._symbol.toUpperCase()] ?? ''}-${this._symbol.toLowerCase()}-logo.svg`;
    }
  }

  @Output() deleteItem = new EventEmitter<boolean>();
  @Output() select = new EventEmitter<string>();

  constructor() { }

  ngOnInit(): void {
  }



}

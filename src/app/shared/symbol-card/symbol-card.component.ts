import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {cryptoMap} from "../../crypto-map";
import {FormControl} from "@angular/forms";

@Component({
  selector: 'app-symbol-card',
  templateUrl: './symbol-card.component.html',
  styleUrls: ['./symbol-card.component.scss']
})
export class SymbolCardComponent implements OnInit {
  _symbol: string | undefined;
  market: string | undefined;
  imgSrc: string | undefined;
  fc: FormControl = new FormControl(true);

  @Input() remove = true;
  @Input() selectable = true;
  @Input() set selected(val: boolean) {
    this.fc.setValue(val);
  }

  @Input()
  set symbol(val: string | undefined) {
    if(val) {
      this._symbol = val.split('-')[0];
      this.imgSrc = `https://cryptologos.cc/logos/${cryptoMap[this._symbol.toUpperCase()] ?? ''}-${this._symbol.toLowerCase()}-logo.svg`;
    }
  }

  @Output() deleteItem = new EventEmitter<boolean>();
  @Output() select = new EventEmitter<string>();
  @Output() deSelect = new EventEmitter<string>();

  constructor() { }

  ngOnInit(): void {
  }

  toggle(val: boolean) {
    if(val) {
      this.select.emit(this._symbol);
    }else {
      this.deSelect.emit(this._symbol);
    }
  }



}

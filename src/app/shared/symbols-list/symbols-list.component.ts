import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {rack} from "../../states/app-state";
import {AntiMemLeak} from "../anti-mem-leak";
import {TitleModel} from "../../core/clients/models/title.model";
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-symbols-list',
  templateUrl: './symbols-list.component.html',
  styleUrls: ['./symbols-list.component.scss']
})
export class SymbolsListComponent extends AntiMemLeak implements OnInit {

  symbols: TitleModel | undefined;
  chunkSize = 10;
  pages: string[][] = [];
  keys = Object.keys;
  blacklist: string[] = [];
  private _search: string  = '';
  @Input() currentPageIndex = 0;
  @Input() fc: FormControl | undefined;
  @Input() set search(symbol: string) {
    this.currentPageIndex = 0;
    this._search = symbol;
    this.symbolsFiltered = Object.keys(this.symbols ?? {}).filter(key => (symbol ?? '') !== '' ? symbol.toUpperCase().indexOf(key) > -1 : true);
  }

  @Output() pagesChange = new EventEmitter();

  constructor() { super(); }

  set symbolsFiltered(val: string[]) {
    if(val.length > 0) {
      this.pages = [];
    }
    while(val.length > 0) {
      this.pages.push(val.splice(0, 10));
    }
    this.pagesChange.emit(this.pages);
  }

  ngOnInit(): void {
    this.sub.add(rack.states.exchange.obs.subscribe((state) => {
      this.symbols = state.titles;
      this.symbolsFiltered = Object.keys(this.symbols ?? {}).filter(key => (this._search ?? '') !== '' ? this._search.indexOf(key) > -1 : true);
    }));
    this.sub.add(
      rack.states.currentWallet.obs.subscribe(wallet => {
        this.blacklist = wallet.blacklist ?? [];
      })
    );
    rack.states.exchange.refreshState();
  }

  removeSymbol(symbol: string) {
    this.fc?.setValue((this.fc?.value ?? []).filter((item: string) => item !== symbol));
  }

  pushSymbol(symbol: string) {
    const value = (this.fc?.value ?? []);
    value.push(symbol);
    this.fc?.setValue(value);
  }

}

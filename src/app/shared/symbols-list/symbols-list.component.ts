import {Component, Input, OnInit} from '@angular/core';
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
  searchForm = new FormGroup({
    symbol: new FormControl('', Validators.required)
  });
  pages: string[][] = [];
  keys = Object.keys;
  currentPageIndex = 0;
  blacklist: string[] = [];

  @Input() fc: FormControl | undefined;

  constructor() { super(); }

  set symbolsFiltered(val: string[]) {
    console.log(val);
    if(val.length > 0) {
      this.pages = [];
    }
    while(val.length > 0) {
      this.pages.push(val.splice(0, 10));
    }
  }

  ngOnInit(): void {
    this.sub.add(
      this.searchForm.valueChanges.subscribe(value => {
        Object.keys(this.symbols ?? {})
        this.currentPageIndex = 0;
        this.symbolsFiltered = Object.keys(this.symbols ?? {}).filter(key => value.symbol !== '' ? value.symbol.toUpperCase().indexOf(key) > -1 : true);
      })
    );
    this.sub.add(rack.states.exchange.obs.subscribe((state) => {
      this.symbols = state.titles;
      this.symbolsFiltered = Object.keys(this.symbols ?? {}).filter(key => this.searchForm.value.symbol !== '' ? this.searchForm.value.symbol.indexOf(key) > -1 : true);
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

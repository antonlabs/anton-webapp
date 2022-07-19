import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-price-change',
  templateUrl: './price-change.component.html',
  styleUrls: ['./price-change.component.scss']
})
export class PriceChangeComponent implements OnInit {
  priceN: number | undefined;

  @Input()
  set price(val: number | string | undefined) {
    if(val !== undefined) {
      if(typeof val === 'string') {
        val = parseFloat(val);
      }
      if(val > 999) {
        this.priceN = Math.floor(val);
      }else {
        this.priceN = parseFloat(val.toFixed(2));
      }
    }
  }

  @Input() symbolPrefix: string | undefined;
  @Input() symbolSuffix: string | undefined;

  constructor() { }

  ngOnInit(): void {
  }

}

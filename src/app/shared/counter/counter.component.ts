import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-counter',
  templateUrl: './counter.component.html',
  styleUrls: ['./counter.component.scss']
})
export class CounterComponent implements OnInit {

  countNumber: number | undefined;
  @Input() icon: string | undefined;
  @Input() image: string | undefined;
  @Input()
  set value(val: number | undefined) {
    if(val !== undefined) {
      if(val > 999) {
        this.countNumber = Math.floor(val);
      }else {
        this.countNumber = parseFloat(val.toFixed(2));
      }
    }
  }
  @Input() sign: string | undefined;
  @Input() description: string | undefined;

  constructor() { }

  ngOnInit(): void {
  }

  isNan = isNaN;




}

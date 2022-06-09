import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { FormControl } from '@angular/forms';
import { tap } from 'rxjs';


@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss']
})
export class SliderComponent implements OnInit {
  @Input()
  set min(val: number) {
    this.options.floor = val;
  }
  @Input()
  set max(val: number) {
    this.options.ceil = Math.floor(val);
  }
  @Output() onChange: EventEmitter<string> = new EventEmitter<string>();
  @Input()
  set fc(val: FormControl) {
    this.formControl = val;

  }

  formControl: FormControl = new FormControl(0);

  options = {
    floor: this.min,
    ceil: this.max,
    showSelectionBar: true
  };

  constructor() { }

  ngOnInit(): void {
    this.formControl.valueChanges.pipe(
      tap((val) => this.onChange.next(val))
    ).subscribe();

  }

}

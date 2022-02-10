import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { FormControl } from '@angular/forms';
import { tap } from 'rxjs';

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss']
})
export class SliderComponent implements OnInit {
  @Input() min: number = 0;
  @Input() max: number = 0;
  @Input() value: number = 15;
  @Output() onChange: EventEmitter<string> = new EventEmitter<string>();
  fc = new FormControl(0);

  constructor() { }

  ngOnInit(): void {
    this.fc.valueChanges.pipe(
      tap((val) => this.onChange.next(val))
    ).subscribe();
  }

}

import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-counter',
  templateUrl: './counter.component.html',
  styleUrls: ['./counter.component.scss']
})
export class CounterComponent implements OnInit {

  @Input() icon: string | undefined;
  @Input() image: string | undefined;
  @Input() value: number = 0;
  @Input() description: string | undefined;

  constructor() { }

  ngOnInit(): void {
  }

}

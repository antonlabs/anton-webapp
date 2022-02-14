import {Component, Input, OnInit} from '@angular/core';
import {AbstractControl, FormControl} from "@angular/forms";

@Component({
  selector: 'app-cash-input',
  templateUrl: './cash-input.component.html',
  styleUrls: ['./cash-input.component.scss']
})
export class CashInputComponent implements OnInit {

  @Input() control: FormControl = new FormControl('');
  @Input() symbols: string[] = [];

  constructor() { }

  ngOnInit(): void {
  }

}

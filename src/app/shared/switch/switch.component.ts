import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl} from "@angular/forms";

@Component({
  selector: 'app-switch',
  templateUrl: './switch.component.html',
  styleUrls: ['./switch.component.scss']
})
export class SwitchComponent implements OnInit {

  @Input() control: FormControl = new FormControl(true);
  @Output() toggle = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  onToggle(event: any) {
    this.toggle.emit(event.target.checked!);
  }

}

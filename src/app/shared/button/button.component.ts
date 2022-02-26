import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent implements OnInit {

  @Input() loading = false;
  @Input() type = 'primary';
  @Input() disabled = false;

  constructor() { }

  ngOnInit(): void {
  }

}

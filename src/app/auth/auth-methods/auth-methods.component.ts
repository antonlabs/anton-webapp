import {Component, EventEmitter, OnInit, Output} from '@angular/core';

export type method = 'email' | 'telegram' | 'phone';

@Component({
  selector: 'app-auth-methods',
  templateUrl: './auth-methods.component.html',
  styleUrls: ['./auth-methods.component.scss']
})
export class AuthMethodsComponent implements OnInit {

  currentMethod: method = 'email';

  @Output() method: EventEmitter<method> = new EventEmitter<method>();

  constructor() { }

  ngOnInit(): void {
  }

  setMethod(method: method) {
    this.currentMethod = method;
    this.method.emit(method);
  }

}

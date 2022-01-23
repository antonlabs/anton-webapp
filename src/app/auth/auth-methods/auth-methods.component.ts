import {Component, Input, OnInit} from '@angular/core';
import {Router} from "@angular/router";

export type method = 'email' | 'telegram' | 'phone';

@Component({
  selector: 'app-auth-methods',
  templateUrl: './auth-methods.component.html',
  styleUrls: ['./auth-methods.component.scss']
})
export class AuthMethodsComponent implements OnInit {

  @Input()
  currentMethod: method = 'email';

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  setMethod(method: method) {
    this.currentMethod = method;
    this.router.navigate(['/auth', method]);
  }

}

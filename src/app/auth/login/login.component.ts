import { Component, OnInit } from '@angular/core';
import {method} from "../auth-methods/auth-methods.component";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  currentMethod: method = 'email';

  constructor() { }

  ngOnInit(): void {
  }



}

import { Component, OnInit } from '@angular/core';
import {method} from "../auth-methods/auth-methods.component";
import {ActivatedRoute, Router} from "@angular/router";
import {AntiMemLeak} from "../../shared/anti-mem-leak";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent extends AntiMemLeak implements OnInit {

  currentMethod: method = this.router.url.split('/').slice(-1)[0] as method;

  constructor(
    private activatedRouter: ActivatedRoute,
    private router: Router
  ) {
    super();
  }

  ngOnInit(): void {
    console.log();
    this.sub.add(this.activatedRouter.url.subscribe(url => {
      if(url[url.length - 1]) {
        this.currentMethod = url[url.length - 1].path as method;
      }
    }));
  }



}

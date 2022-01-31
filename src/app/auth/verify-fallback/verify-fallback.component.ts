import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {AuthService} from "../auth.service";

@Component({
  selector: 'app-verify-fallback',
  templateUrl: './verify-fallback.component.html',
  styleUrls: ['./verify-fallback.component.scss']
})
export class VerifyFallbackComponent implements OnInit {

  constructor(
    private activatedRoute: ActivatedRoute,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(queryParams => {
      if(queryParams['user'] && queryParams['key']) {
        this.authService.login(queryParams['user'], queryParams['key']).then(
          (res) => console.log(res)
        );
      }
    });
  }

}

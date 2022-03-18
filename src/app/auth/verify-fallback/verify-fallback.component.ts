import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../auth.service";

@Component({
  selector: 'app-verify-fallback',
  templateUrl: './verify-fallback.component.html',
  styleUrls: ['./verify-fallback.component.scss']
})
export class VerifyFallbackComponent implements OnInit {

  error: string | undefined;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(queryParams => {
      this.authenticate(queryParams);
    });
  }

  async authenticate(queryParams: any) {
    try {
      if(queryParams['code']) {
        await this.authService.loginWithIdpCode(queryParams['code']);
      }else if(queryParams['user'] && queryParams['key']) {
        await this.authService.login(queryParams['user'].replace(' ', '+'), queryParams['key']);
      }else {
        this.router.navigate(['/auth']);
      }
    }catch(e: any) {
      console.log(e);
      this.error = e?.error?.error;
    }
  }

}

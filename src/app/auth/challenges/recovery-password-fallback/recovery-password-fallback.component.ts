import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../auth.service";
import {AntiMemLeak} from "../../../shared/anti-mem-leak";

@Component({
  selector: 'app-recovery-password-fallback',
  templateUrl: './recovery-password-fallback.component.html',
  styleUrls: ['./recovery-password-fallback.component.scss']
})
export class RecoveryPasswordFallbackComponent extends AntiMemLeak implements OnInit {

  code: string | undefined;
  username: string | undefined;
  loading = false;
  error: string | undefined;

  form: FormGroup = new FormGroup({
    newPassword: new FormControl('', Validators.required)
  })

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {
    super();
  }

  ngOnInit(): void {
    this.sub.add(
      this.activatedRoute.queryParams.subscribe(params => {
        this.code = params['code'];
        this.username = params['user'];
        if(!this.code || !this.username) {
          this.router.navigate(['/auth']);
        }
      })
    );
  }

  async changePassword() {
    if(this.form.valid && this.code && this.username) {
      this.loading = true;
      try{
        await this.authService.confirmForgotPassword(this.code, this.username, this.form.value.newPassword)
      }catch(e) {
        this.error = $localize`Ops, something were wrong with your request`;
      }finally {
        this.loading = false;
      }
    }
  }




}

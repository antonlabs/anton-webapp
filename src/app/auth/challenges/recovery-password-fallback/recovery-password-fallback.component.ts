import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../auth.service";
import {AntiMemLeak} from "../../../shared/anti-mem-leak";
import { rack } from 'src/app/states/app-state';

@Component({
  selector: 'app-recovery-password-fallback',
  templateUrl: './recovery-password-fallback.component.html',
  styleUrls: ['./recovery-password-fallback.component.scss']
})
export class RecoveryPasswordFallbackComponent extends AntiMemLeak implements OnInit {

  code: string | undefined;
  loading = false;
  error: string | undefined;
  success = true;

  form: FormGroup = new FormGroup({
    email: new FormControl('', Validators.required),
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
        this.form.controls['email'].setValue(rack.states.user.val.lastEmailRecover ?? '');
        if(!this.code) {
          this.router.navigate(['/auth']);
        }
      })
    );
  }

  async changePassword() {
    if(this.form.valid && this.code) {
      this.loading = true;
      try{
        const result = await this.authService.confirmForgotPassword(this.code, this.form.value.email, this.form.value.newPassword);
        console.log(result);
        this.success = true;
        setTimeout(() => {
          this.router.navigate(['/']);
        },2000);
      }catch(e) {
        this.error = $localize`Ops, something were wrong with your request`;
      }finally {
        this.loading = false;
      }
    }else {
      this.error = $localize`Both fields are mandatory`;
    }
  }




}

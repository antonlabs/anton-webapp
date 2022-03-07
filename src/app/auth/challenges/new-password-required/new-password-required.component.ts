import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../auth.service";
import {ActivatedRoute, Router} from "@angular/router";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AntiMemLeak} from "../../../shared/anti-mem-leak";

@Component({
  selector: 'app-new-password-required',
  templateUrl: './new-password-required.component.html',
  styleUrls: ['./new-password-required.component.scss']
})
export class NewPasswordRequiredComponent extends AntiMemLeak implements OnInit {

  username: string | undefined;
  session: string | undefined;
  error: string | undefined;
  loading = false

  form: FormGroup = new FormGroup({
    newPassword: new FormControl('', Validators.required)
  })

  constructor(
    private authService: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    super();
  }

  ngOnInit(): void {
    this.sub.add(
      this.activatedRoute.queryParams.subscribe(queryParams => {
        this.username = queryParams['username'];
        this.session = queryParams['session'];
      })
    );
  }

  async changePassword() {
    if(this.form.valid && this.username && this.session) {
      this.loading = true;
      try {
        await this.authService.confirmNewPassword(this.username, this.form.value.newPassword, this.session);
        this.router.navigate(['/']);
      }catch(e) {
        this.error = $localize`Ops, something were wrong with your request`;
      }finally {
        this.loading = false;
      }
    }
  }

}

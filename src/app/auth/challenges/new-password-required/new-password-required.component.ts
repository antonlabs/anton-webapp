import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../auth.service";
import {ActivatedRoute} from "@angular/router";
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-new-password-required',
  templateUrl: './new-password-required.component.html',
  styleUrls: ['./new-password-required.component.scss']
})
export class NewPasswordRequiredComponent implements OnInit {

  username: string | undefined;
  session: string | undefined;

  form: FormGroup = new FormGroup({
    newPassword: new FormControl('', Validators.required)
  })

  constructor(
    private authService: AuthService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(queryParams => {
      this.username = queryParams['username'];
      this.session = queryParams['session'];
    });
  }

  async changePassword() {
    if(this.form.valid && this.username && this.session) {
      await this.authService.confirmNewPassword(this.username, this.form.value.newPassword, this.session);
    }
  }

}

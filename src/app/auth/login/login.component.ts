import { Component, OnInit } from '@angular/core';
import {AntiMemLeak} from "../../shared/anti-mem-leak";
import {ReCaptchaV3Service} from "ng-recaptcha";
import {AuthService} from "../auth.service";
import {Form} from "../form";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent extends AntiMemLeak implements OnInit {

  constructor(
    private recaptchaV3Service: ReCaptchaV3Service,
    private authService: AuthService
  ) {super();}

  ngOnInit(): void {}

  onMountChild(component: Form) {
    component?.submit.subscribe((val) => this.login(val));
  }

  public login(data: any): void {
    this.authService.login(data.user, data.password);
  }


}

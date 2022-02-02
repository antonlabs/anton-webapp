import { Component, OnInit } from '@angular/core';
import {AntiMemLeak} from "../../shared/anti-mem-leak";
import {ReCaptchaV3Service} from "ng-recaptcha";
import {AuthService} from "../auth.service";
import {Form} from "../form";
import {environment} from "../../../environments/environment";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent extends AntiMemLeak implements OnInit {

  email: string | undefined;
  location = location;
  cognitoUrl = environment.cognitoUrl;

  constructor(
    private recaptchaV3Service: ReCaptchaV3Service,
    private authService: AuthService,
    private router: Router
  ) {super();}

  ngOnInit(): void {}

  onMountChild(component: Form) {
    component.form.valueChanges.subscribe(value => {
      this.email = value.email;
    })
    component?.submit.subscribe((val) => this.login(val));
  }

  public async login(data: any): Promise<void> {
    console.log(data);
    const result = await this.authService.login(data.email, data.password);
    this.router.navigate(['/']);
  }


}

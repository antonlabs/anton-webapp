import { Component, OnInit } from '@angular/core';
import {AntiMemLeak} from "../../shared/anti-mem-leak";
import {ReCaptchaV3Service} from "ng-recaptcha";
import {AuthService} from "../auth.service";
import {Form} from "../form";
import {environment} from "../../../environments/environment";
import { currentLocation } from 'src/app/core/location';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent extends AntiMemLeak implements OnInit {

  email: string | undefined;
  location = location;
  cognitoUrl = environment.cognitoUrl;
  environment = environment;

  constructor(
    private recaptchaV3Service: ReCaptchaV3Service,
    private authService: AuthService
  ) {
    super();
    console.log(this.cognitoUrl);
  }

  ngOnInit(): void {}

  onMountChild(component: Form) {
    component.form.valueChanges.subscribe(value => {
      this.email = value.email;
    })
    component?.submit.subscribe((val) => this.login(val, component));
  }

  get currentLocation() {
    return currentLocation();
  }

  public async login(data: any, component: Form): Promise<void> {
    component.loading = true;
    try {
      await this.authService.login(data.email.replace(' ', '+'), data.password);
      location.reload();
    }catch(e: any) {
      console.log(e);
      if(e.message.indexOf('Incorrect') > -1 || e.message.indexOf('User does not exist') > -1) {
        component.error.emit($localize`Incorrect username or password, please check and retry but not too many times`);
      }else {
        component.error.emit($localize`Error during login, sorry, please retry later`);
      }
    }finally {
      component.loading = false;
    }
  }


}

import {Component, OnInit} from '@angular/core';
import {ReCaptchaV3Service} from "ng-recaptcha";
import {AuthService} from "../auth.service";
import {Form} from "../form";
import {firstValueFrom} from "rxjs";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  success: boolean = false;
  error: string | undefined;
  email: string | undefined;

  constructor(
    private recaptchaV3Service: ReCaptchaV3Service,
    private authService: AuthService
  ) {}

  ngOnInit(): void {}

  onMountChild(component: Form) {
    component.form.valueChanges.subscribe(value => {
      this.email = value.email;
    })
    component?.submit.subscribe((val) => {
      this.register(val, component)
    });
  }

  public async register(data: any, component: Form): Promise<void> {
    component.loading = true;
    this.error = undefined;
    try {
      const token = await firstValueFrom(this.recaptchaV3Service.execute('register'));
      await this.authService.signup(data.email, token);
      this.success = true;
    }catch(e: any) {
      console.error(e);
      this.error = e.message;
    }finally {
      component.loading = false;
    }
  }



}

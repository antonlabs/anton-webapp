import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute} from "@angular/router";
import { rack } from 'src/app/states/app-state';
import {AuthService} from "../auth.service";

@Component({
  selector: 'app-send-recovery-mail',
  templateUrl: './send-recovery-mail.component.html',
  styleUrls: ['./send-recovery-mail.component.scss']
})
export class SendRecoveryMailComponent implements OnInit {

  loading = false;
  error: string | undefined;
  finish = false;
  success = false;


  form: FormGroup = new FormGroup({
    user: new FormControl('', Validators.required)
  });

  constructor(
    private activatedRoute: ActivatedRoute,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(queryParams => {
      this.form.setValue({
        user: queryParams['user']
      })
    })
  }

  async submit() {
    this.loading = true;
    try {
      await this.authService.recoveryPassword(this.form.value.user);
      rack.states.user.set({
        lastEmailRecover: this.form.value.user
      });
      rack.states.user.store();
      this.success = true;
    }catch(e: any) {
      this.error = e.message;
    }finally {
      this.loading = false;
    }
  }

}

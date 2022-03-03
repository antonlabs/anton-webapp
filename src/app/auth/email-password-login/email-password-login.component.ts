import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute} from "@angular/router";
import {Form} from "../form";
import {AntiMemLeak} from "../../shared/anti-mem-leak";

@Component({
  selector: 'app-email-password-login',
  templateUrl: './email-password-login.component.html',
  styleUrls: ['./email-password-login.component.scss']
})
export class EmailPasswordLoginComponent extends Form implements OnInit {


  form: FormGroup = new FormGroup({
    email: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  });

  buttonString: string | undefined;

  constructor(private activeRouter: ActivatedRoute) {
    super();
    this.sub.add(
      this.activeRouter.data.subscribe((data) => this.buttonString = data['buttonString'])
    );
  }

  ngOnInit(): void {}


}

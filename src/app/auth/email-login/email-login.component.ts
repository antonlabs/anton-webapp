import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Form} from "../form";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-email-login',
  templateUrl: './email-login.component.html',
  styleUrls: ['./email-login.component.scss']
})
export class EmailLoginComponent extends Form implements OnInit {
  form: FormGroup = new FormGroup({
    email: new FormControl('', Validators.required)
  });

  buttonString: string | undefined;

  constructor(private activeRouter: ActivatedRoute) {
    super();
    this.activeRouter.data.subscribe((data) => this.buttonString = data['buttonString']);
  }

  ngOnInit(): void {}

}

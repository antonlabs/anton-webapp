import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-send-recovery-mail',
  templateUrl: './send-recovery-mail.component.html',
  styleUrls: ['./send-recovery-mail.component.scss']
})
export class SendRecoveryMailComponent implements OnInit {

  form: FormGroup = new FormGroup({
    user: new FormControl('', Validators.required)
  });

  constructor() { }

  ngOnInit(): void {
  }

}

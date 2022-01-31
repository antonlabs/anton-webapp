import {FormGroup} from "@angular/forms";
import {EventEmitter} from "@angular/core";

export abstract class Form {
  submit: EventEmitter<any> = new EventEmitter<any>();
  error: EventEmitter<string> = new EventEmitter<string>();
  loading = false;
  abstract form: FormGroup;
  errorString: string | undefined;

  constructor() {
    this.error.subscribe((message) => this.errorString = message);
  }

  onSubmit(data: any) {
    if(this.form.valid) {
      this.submit.emit(data);
    }else {
      this.error.emit('Fields are not valid');
    }
  }
}

import {FormGroup} from "@angular/forms";
import {EventEmitter} from "@angular/core";
import {AntiMemLeak} from "../shared/anti-mem-leak";

export abstract class Form extends AntiMemLeak {
  submit: EventEmitter<any> = new EventEmitter<any>();
  error: EventEmitter<string> = new EventEmitter<string>();
  loading = false;
  abstract form: FormGroup;
  errorString: string | undefined;

  constructor() {
    super();
    this.sub.add(this.error.subscribe((message) => this.errorString = message));
  }

  onSubmit(data: any) {
    if(this.form.valid) {
      this.submit.emit(data);
    }else {
      this.error.emit('Fields are not valid');
    }
  }
}

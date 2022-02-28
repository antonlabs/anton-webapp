import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {FormControl, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-profile-overview',
  templateUrl: './profile-overview.component.html',
  styleUrls: ['./profile-overview.component.scss']
})
export class ProfileOverviewComponent implements OnInit {

  form = new FormGroup({
    firstname: new FormControl(''),
    lastname: new FormControl(''),
    age: new FormControl(''),
  });

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  fileChangeEvent(event: any) {
    const file = event.target.files[0];
    const reader = new FileReader();
    const $this = this;
    reader.readAsDataURL(file);
    reader.onload = function () {
      localStorage.setItem('profile-image', reader.result as any);
      $this.router.navigate(['/profile'], {queryParams: {modal: 'cropImage', lsK: 'profile-image'}})
    };
    reader.onerror = function (error) {
      console.log('Error: ', error);
    };
  }


}

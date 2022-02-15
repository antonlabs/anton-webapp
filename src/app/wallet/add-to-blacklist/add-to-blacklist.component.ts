import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-add-to-blacklist',
  templateUrl: './add-to-blacklist.component.html',
  styleUrls: ['./add-to-blacklist.component.scss']
})
export class AddToBlacklistComponent implements OnInit {

  form = new FormGroup({
    cryptoName: new FormControl('', Validators.required),
    cryptoMarket: new FormControl('all', Validators.required)
  });

  constructor() { }

  ngOnInit(): void {
  }



}

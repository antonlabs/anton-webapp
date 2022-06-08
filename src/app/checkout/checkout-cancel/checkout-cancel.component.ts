import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkout-cancel',
  templateUrl: './checkout-cancel.component.html',
  styleUrls: ['./checkout-cancel.component.scss']
})
export class CheckoutCancelComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.router.navigate(['/']);
  }

}

import { Injectable } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  data: any;
  currentTimeout: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  success(message: string) {
    if(this.currentTimeout) {
      clearTimeout(this.currentTimeout);
      this.currentTimeout = undefined;
    }
    this.router.navigate([this.router.url], {queryParams: {dialog: message, type: 'success'}});
  }

  error(message: string) {
    this.router.navigate([this.router.url], {queryParams: {dialog: message, type: 'error'}});
  }


  closeNotification(): void {
    const queryParams = JSON.parse(JSON.stringify(this.activatedRoute.snapshot.queryParams));
    queryParams['dialog'] = undefined;
    queryParams['type'] = undefined;
    const url = this.router.url.slice(1).split('?')[0].split('/');
    url[0] = '/' + url[0];
    this.data = undefined;
    this.router.navigate(url, {queryParams});
  }

}

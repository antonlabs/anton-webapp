import { Injectable } from '@angular/core';
import {ActivatedRoute, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  data: any;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  closeModal(): void {
    const queryParams = JSON.parse(JSON.stringify(this.activatedRoute.snapshot.queryParams));
    queryParams['modal'] = undefined;
    const url = this.router.url.slice(1).split('?')[0].split('/');
    url[0] = '/' + url[0];
    this.data = undefined;
    this.router.navigate(url, {queryParams});
  }

}

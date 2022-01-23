import {Injectable, OnDestroy} from '@angular/core';
import {Subscription} from 'rxjs';

@Injectable()
export class AntiMemLeak implements OnDestroy{
  sub: Subscription = new Subscription();
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}

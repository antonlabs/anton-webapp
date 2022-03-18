import {Injectable, OnDestroy} from '@angular/core';
import {Subscription} from 'rxjs';

@Injectable()
export class AntiMemLeak implements OnDestroy{
  sub: Subscription = new Subscription();
  intervals: any[] = [];
  ngOnDestroy(): void {
    this.sub.unsubscribe();
    for(const interval of this.intervals) {
      clearInterval(interval);
    }
  }
}

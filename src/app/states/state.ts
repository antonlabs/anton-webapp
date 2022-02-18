import {BehaviorSubject, filter, Observable} from "rxjs";

export abstract class State<T> {
  protected sub: BehaviorSubject<T> = new BehaviorSubject<T>(
    this.fromLocalStorage()
  );

  constructor(private localStorageKey: string) {}

  fromLocalStorage(): T {
    const content = localStorage.getItem(this.localStorageKey);
    if(content) {
      return JSON.parse(content);
    }
    return this.empty();
  }

  get obs(): Observable<T> {
    return this.sub.pipe(filter((val) => val !== undefined)) as Observable<T>;
  }

  store(): void {
    localStorage.setItem(this.localStorageKey, JSON.stringify(this.sub.value));
  }

  get val(): T {
    return this.sub.value ?? this.empty();
  }

  set(value: Partial<T> | any) {
    const actualValue = JSON.parse(JSON.stringify(this.sub.value));
    this.sub.next({...actualValue, ...value});
  }

  abstract empty(): T;
}

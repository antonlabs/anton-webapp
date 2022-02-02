import {BehaviorSubject} from "rxjs";

const storageKey = 'state';

export interface AppStateProps {
  refreshToken: string | undefined;
  accessKeyId: string | undefined;
  secretAccessKeyId: string | undefined;
  accessToken: string | undefined;
  idToken: string | undefined;
  identityId: string | undefined;
  deviceKey: string | undefined;
}

export class AppState {
  constructor(public props: AppStateProps) {};

  static empty(): AppState {
    return new AppState({
      refreshToken: undefined,
      accessKeyId: undefined,
      secretAccessKeyId: undefined,
      accessToken: undefined,
      idToken: undefined,
      identityId: undefined,
      deviceKey: undefined
    });
  }

  static set(value: Partial<AppStateProps>) {
    const actualValue = JSON.parse(JSON.stringify(AppState.val));
    console.log(actualValue, value);
    appState.next(new AppState({...actualValue, ...value}))
  }

  static get val(): AppStateProps {
    return appState.value.props;
  }

  static store() {
    const actualState = AppState.val;
    localStorage.setItem(storageKey, JSON.stringify(actualState));
  }

  static fromStore(): AppState {
    const content = localStorage.getItem(storageKey);
    if(content) {
      const state = JSON.parse(content);
      return new AppState(state);
    }
    return AppState.empty();
  }
}

export const appState = new BehaviorSubject(AppState.fromStore());

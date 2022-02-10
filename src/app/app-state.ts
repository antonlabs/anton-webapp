import {BehaviorSubject} from "rxjs";
import {IAMCredentials, OAuthCredentials} from "./auth/auth.service";
import {WalletState} from "./shared/wallet.service";
import {UserState} from "./shared/user.service";

const storageKey = 'state';

export interface AppStateProps {
  oauthCredentials: Partial<OAuthCredentials>;
  iamCredentials: Partial<IAMCredentials>;
  identityId: string | undefined;
  currentWalletName: string | undefined;
  wallets: Partial<WalletState>[];
  user: Partial<UserState>;
}

export class AppState {
  constructor(public props: AppStateProps) {};

  static empty(): AppState {
    return new AppState({
      oauthCredentials: {},
      iamCredentials: {},
      identityId: undefined,
      currentWalletName: undefined,
      user: {},
      wallets: []
    });
  }

  static set(value: Partial<AppStateProps>) {
    const actualValue = JSON.parse(JSON.stringify(AppState.val));
    appState.next(new AppState({...actualValue, ...value}))
  }

  static get val(): AppStateProps {
    return appState.value.props;
  }

  static store() {
    localStorage.setItem(storageKey, JSON.stringify(AppState.val));
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

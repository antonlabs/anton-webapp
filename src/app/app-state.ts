import {BehaviorSubject} from "rxjs";
import {IAMCredentials, OAuthCredentials} from "./auth/auth.service";
import {WalletState} from "./shared/wallet.service";
import {UserState} from "./shared/user.service";
import { WalletModel } from "./wallet/models/wallet.model";
import { getLiteral } from "./shared/helpers";

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

  static set(value: Partial<AppStateProps> | any, key?: string | undefined) {
    const actualValue = JSON.parse(JSON.stringify(key ? getLiteral(key, AppState.val) : AppState.val));
    if (key) {
      appState.next(new AppState({...actualValue, ...{[key]: value}}))
    } else {
      appState.next(new AppState({...actualValue, ...value}))
    }
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

  static getWalletByName(name: string): Partial<WalletModel> | undefined {
    return appState.value.props.wallets.filter(wallet => wallet?.name === name)[0];
  }

  static getCurrentWallet(): WalletModel | undefined {
    if(AppState.val.currentWalletName) {
      return AppState.getWalletByName(AppState.val.currentWalletName!) as WalletModel;
    }
    return undefined;
  }
}

export const appState = new BehaviorSubject(AppState.fromStore());

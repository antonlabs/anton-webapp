import {BehaviorSubject} from "rxjs";
import {IAMCredentials, OAuthCredentials} from "./auth/auth.service";
import {WalletState} from "./shared/wallet.service";
import {UserState} from "./shared/user.service";
import {WalletModel} from "./wallet/models/wallet.model";
import {getLiteral} from "./shared/helpers";
import {BinanceClient} from "./core/clients/binance-client";
import {environment} from "../environments/environment";
import {ExchangeClient} from "./core/clients/exchange-client";
import {WalletType} from "./wallet/enums/wallet-type.enum";
import { TitleModel } from "./core/clients/models/title.model";

const storageKey = 'state';

export interface AppStateProps {
  oauthCredentials: Partial<OAuthCredentials>;
  iamCredentials: Partial<IAMCredentials>;
  identityId: string | undefined;
  currentWalletName: string | undefined;
  wallets: Partial<WalletState>[];
  symbols: TitleModel;
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
      wallets: [],
      symbols: {}
    });
  }

  static set(value: Partial<AppStateProps> | any) {
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

  static getWalletByName(name: string): Partial<WalletModel> | undefined {
    return appState.value.props.wallets.filter(wallet => wallet?.name === name)[0];
  }

  static getCurrentWallet(): WalletModel | undefined {
    if(AppState.val.currentWalletName) {
      return AppState.getWalletByName(AppState.val.currentWalletName!) as WalletModel;
    }
    return undefined;
  }

  static exchangeClient(): ExchangeClient | undefined {
    if(AppState.getCurrentWallet()?.type === WalletType.BINANCE) {
      return new BinanceClient(
        environment.binanceEndpoint,
        AppState.getCurrentWallet()?.accessKey ?? '',
        AppState.getCurrentWallet()?.secretKey ?? '',
      );
    }
    return undefined;
  }
}

export const appState = new BehaviorSubject(AppState.fromStore());

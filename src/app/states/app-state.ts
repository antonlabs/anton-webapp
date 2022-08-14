import {IamCredentialsState} from './iam-credentials-state';
import { CredentialsState } from './credentials-state';
import {WalletState} from "./wallet-state";
import { UserState } from './user-state';
import {WalletsState} from "./wallets-state";
import { ExchangeState } from './exchange-state';
import {PreferencesState} from "./preferences-state";
import {Rack} from "@antonlabs/rack";
import {MarketState} from "./market-state";


export const rack = new Rack({
  currentWallet: new WalletState('wallet-state'),
  oAuthCredentials: new CredentialsState('oAuthCredentials'),
  iamCredentials: new IamCredentialsState('iam-credentials-state'),
  user: new UserState('user'),
  wallets: new WalletsState('wallets'),
  market: new MarketState('market'),
  preferences: new PreferencesState('preferences'),
  exchange: new ExchangeState('exchange-state')
});

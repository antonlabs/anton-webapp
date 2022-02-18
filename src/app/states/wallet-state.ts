import { State } from "./state";
import {WalletModel} from "../wallet/models/wallet.model";

export interface WalletProperties extends WalletModel {}

export class WalletState extends State<WalletProperties> {

  empty(): WalletProperties {
    return {
      name: '',
      symbolMarket: undefined,
      units: undefined,
      earnings: undefined,
      totalEarnings: undefined,
      type: undefined,
      accessKey: undefined,
      secretKey: undefined,
      valuePerUnits: undefined,
      blacklist: []
    };
  }


}

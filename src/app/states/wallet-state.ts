import {WalletModel} from "../wallet/models/wallet.model";
import {State} from "@antonlabs/rack";

export interface WalletProperties extends WalletModel {}

export class WalletState extends State<WalletProperties> {

  onCreate(): WalletProperties {
    return {
      name: '',
      symbolMarket: undefined,
      units: undefined,
      alias: undefined,
      earnings: undefined,
      totalEarnings: undefined,
      type: undefined,
      accessKey: undefined,
      secretKey: undefined,
      valuePerUnits: undefined,
      blacklist: []
    };
  }

  async refreshState(): Promise<void> {}


}

import { State } from "./state";

export interface WalletStateProps {
  wallets: string[];
}


export class WalletsState extends State<WalletStateProps> {

    empty(): WalletStateProps {
      return {
        wallets: []
      }
    }

}

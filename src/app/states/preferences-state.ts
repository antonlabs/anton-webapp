import {State} from "@antonlabs/rack";

export interface PreferencesProperties {
  blacklistDeleteConfirmation: boolean;
}

export class PreferencesState extends State<PreferencesProperties> {

  onCreate(): PreferencesProperties {
    return {
      blacklistDeleteConfirmation: true
    };
  }

  async refreshState(): Promise<void> {
  }

}

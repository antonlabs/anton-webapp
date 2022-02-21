import { State } from "./state";

export interface PreferencesProperties {
  blacklistDeleteConfirmation: boolean;
}

export class PreferencesState extends State<PreferencesProperties> {
  empty(): PreferencesProperties {
    return {
      blacklistDeleteConfirmation: true
    };
  }

}

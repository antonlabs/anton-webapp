import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Validators } from '@angular/forms';
import { appState } from 'src/app/app-state';
import {AntiMemLeak} from "../../shared/anti-mem-leak";

@Component({
  selector: 'app-wallet-overview',
  templateUrl: './wallet-overview.component.html',
  styleUrls: ['./wallet-overview.component.scss']
})
export class WalletOverviewComponent extends AntiMemLeak implements OnInit {
  name: string | undefined;
  addBlackListForm = new FormGroup({
    symbol: new FormControl('', Validators.required)
  });

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.sub.add(
      appState.subscribe(state => {
        this.name = state.props.user.name;
      })
    );
  }


}

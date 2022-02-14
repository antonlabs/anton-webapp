import { Component, Input, OnInit } from '@angular/core';
import { appState } from 'src/app/app-state';
import {AntiMemLeak} from "../anti-mem-leak";

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss']
})
export class AvatarComponent extends AntiMemLeak implements OnInit {

  @Input() size: {width: string, height: string} = {width: '50px', height: '50px'};

  avatarImage: string | undefined;

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.sub.add(appState.subscribe(state => this.avatarImage = state.props.user.avatar));
  }

}

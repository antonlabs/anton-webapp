import { Component, Input, OnInit } from '@angular/core';
import { appState } from 'src/app/app-state';
import {AntiMemLeak} from "../anti-mem-leak";

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss']
})
export class AvatarComponent extends AntiMemLeak implements OnInit {

  @Input() fontSize: string = '40px';
  @Input() size: string = '50px';
  avatarImage: string | undefined;
  errorLoadingImage = false;

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.avatarImage = appState.value.props.user.avatar;
    console.log(this.avatarImage);
    this.sub.add(appState.subscribe(state => this.avatarImage = state.props.user.avatar));
  }

}

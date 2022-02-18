import { Component, Input, OnInit } from '@angular/core';
import { states } from 'src/app/states/app-state';
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
    this.avatarImage = states.user.val.avatar;
    this.sub.add(states.user.obs.subscribe(state => this.avatarImage = state?.avatar));
  }

}
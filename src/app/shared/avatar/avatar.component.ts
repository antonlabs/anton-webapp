import { Component, Input, OnInit } from '@angular/core';
import {rack} from 'src/app/states/app-state';
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
  firstLetter: string | undefined;

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.avatarImage = rack.states.user.val.avatar;
    this.sub.add(rack.states.user.obs.subscribe(state => {
      this.firstLetter = state.email?.charAt(0).toUpperCase();
      this.avatarImage = state?.avatar;
    }));

  }


}

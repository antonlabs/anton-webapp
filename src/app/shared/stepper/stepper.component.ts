import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import {Subscription} from "rxjs";

export interface Step {
  id: string;
  label: string;
  state: undefined | 'complete' | 'in-progress';
}

@Component({
  selector: 'app-stepper',
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.scss']
})
export class StepperComponent implements OnInit {

  steps: Step[] = [];

  subs = new Subscription();

  constructor(
    private router: Router,
    private activatedRouter: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.steps = (this.activatedRouter.snapshot.data as any).stepper;
    this.fillStep();
    this.subs.add(
      this.router.events.subscribe((event) => {
        if(event instanceof NavigationEnd) {
          this.fillStep();
        }
      })
    )
  }

  fillStep() {
    const currentStepId = (this.activatedRouter.snapshot.firstChild?.data as any)?.stepper;
    console.log(currentStepId);
    if(this.steps.filter(step => step.id === currentStepId).length > 0) {
      let alreadyFlagged = false;
      for(const step of this.steps) {
        step.state = alreadyFlagged ? undefined : 'complete';
        if(step.id === currentStepId) {
          step.state = 'in-progress';
          alreadyFlagged = true;
        }
      }
    }
  }

}

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RunStrategyDescriptionComponent } from './run-strategy-description.component';

describe('RunStrategyDescriptionComponent', () => {
  let component: RunStrategyDescriptionComponent;
  let fixture: ComponentFixture<RunStrategyDescriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RunStrategyDescriptionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RunStrategyDescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RevenuesChartComponent } from './revenues-chart.component';

describe('RevenuesChartComponent', () => {
  let component: RevenuesChartComponent;
  let fixture: ComponentFixture<RevenuesChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RevenuesChartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RevenuesChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

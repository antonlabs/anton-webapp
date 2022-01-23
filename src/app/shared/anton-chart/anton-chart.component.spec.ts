import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AntonChartComponent } from './anton-chart.component';

describe('AntonChartComponent', () => {
  let component: AntonChartComponent;
  let fixture: ComponentFixture<AntonChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AntonChartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AntonChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

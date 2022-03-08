import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderChartComponent } from './order-chart.component';

describe('OrderChartComponent', () => {
  let component: OrderChartComponent;
  let fixture: ComponentFixture<OrderChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderChartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

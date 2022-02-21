import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderInspectionComponent } from './order-inspection.component';

describe('OrderInspectionComponent', () => {
  let component: OrderInspectionComponent;
  let fixture: ComponentFixture<OrderInspectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderInspectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderInspectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

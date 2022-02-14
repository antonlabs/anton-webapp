import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashInputComponent } from './cash-input.component';

describe('CashInputComponent', () => {
  let component: CashInputComponent;
  let fixture: ComponentFixture<CashInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CashInputComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CashInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhoneLoginComponent } from './phone-login.component';

describe('PhoneLoginComponent', () => {
  let component: PhoneLoginComponent;
  let fixture: ComponentFixture<PhoneLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PhoneLoginComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PhoneLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

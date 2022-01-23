import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MfaRequiredComponent } from './mfa-required.component';

describe('MfaRequiredComponent', () => {
  let component: MfaRequiredComponent;
  let fixture: ComponentFixture<MfaRequiredComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MfaRequiredComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MfaRequiredComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailPasswordLoginComponent } from './email-password-login.component';

describe('EmailPasswordLoginComponent', () => {
  let component: EmailPasswordLoginComponent;
  let fixture: ComponentFixture<EmailPasswordLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmailPasswordLoginComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailPasswordLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

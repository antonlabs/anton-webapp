import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendRecoveryMailComponent } from './send-recovery-mail.component';

describe('SendRecoveryMailComponent', () => {
  let component: SendRecoveryMailComponent;
  let fixture: ComponentFixture<SendRecoveryMailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SendRecoveryMailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SendRecoveryMailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

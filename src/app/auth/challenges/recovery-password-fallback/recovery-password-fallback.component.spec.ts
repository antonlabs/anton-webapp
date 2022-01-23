import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecoveryPasswordFallbackComponent } from './recovery-password-fallback.component';

describe('RecoveryPasswordFallbackComponent', () => {
  let component: RecoveryPasswordFallbackComponent;
  let fixture: ComponentFixture<RecoveryPasswordFallbackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecoveryPasswordFallbackComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecoveryPasswordFallbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

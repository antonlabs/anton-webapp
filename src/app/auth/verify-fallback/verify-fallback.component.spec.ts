import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyFallbackComponent } from './verify-fallback.component';

describe('VerifyFallbackComponent', () => {
  let component: VerifyFallbackComponent;
  let fixture: ComponentFixture<VerifyFallbackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerifyFallbackComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VerifyFallbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

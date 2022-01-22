import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WalletLayoutComponent } from './wallet-layout.component';

describe('WalletLayoutComponent', () => {
  let component: WalletLayoutComponent;
  let fixture: ComponentFixture<WalletLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WalletLayoutComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WalletLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

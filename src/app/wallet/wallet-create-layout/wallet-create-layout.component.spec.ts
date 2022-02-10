import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WalletCreateLayoutComponent } from './wallet-create-layout.component';

describe('WalletCreateLayoutComponent', () => {
  let component: WalletCreateLayoutComponent;
  let fixture: ComponentFixture<WalletCreateLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WalletCreateLayoutComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WalletCreateLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

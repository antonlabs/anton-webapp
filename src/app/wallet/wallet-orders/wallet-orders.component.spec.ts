import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WalletOrdersComponent } from './wallet-orders.component';

describe('WalletOrdersComponent', () => {
  let component: WalletOrdersComponent;
  let fixture: ComponentFixture<WalletOrdersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WalletOrdersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WalletOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WalletNameComponent } from './wallet-name.component';

describe('WalletNameComponent', () => {
  let component: WalletNameComponent;
  let fixture: ComponentFixture<WalletNameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WalletNameComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WalletNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

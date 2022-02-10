import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WalletPlatformComponent } from './wallet-platform.component';

describe('WalletPlatformComponent', () => {
  let component: WalletPlatformComponent;
  let fixture: ComponentFixture<WalletPlatformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WalletPlatformComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WalletPlatformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

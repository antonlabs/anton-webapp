import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteWalletMethodsComponent } from './delete-wallet-methods.component';

describe('DeleteWalletMethodsComponent', () => {
  let component: DeleteWalletMethodsComponent;
  let fixture: ComponentFixture<DeleteWalletMethodsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteWalletMethodsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteWalletMethodsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

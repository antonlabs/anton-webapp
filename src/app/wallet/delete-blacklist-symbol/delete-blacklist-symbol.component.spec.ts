import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteBlacklistSymbolComponent } from './delete-blacklist-symbol.component';

describe('DeleteBlacklistSymbolComponent', () => {
  let component: DeleteBlacklistSymbolComponent;
  let fixture: ComponentFixture<DeleteBlacklistSymbolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteBlacklistSymbolComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteBlacklistSymbolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

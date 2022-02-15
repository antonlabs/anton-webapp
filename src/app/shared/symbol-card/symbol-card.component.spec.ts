import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SymbolCardComponent } from './symbol-card.component';

describe('SymbolCardComponent', () => {
  let component: SymbolCardComponent;
  let fixture: ComponentFixture<SymbolCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SymbolCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SymbolCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SymbolAnalysisComponent } from './symbol-analysis.component';

describe('SymbolAnalysisComponent', () => {
  let component: SymbolAnalysisComponent;
  let fixture: ComponentFixture<SymbolAnalysisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SymbolAnalysisComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SymbolAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

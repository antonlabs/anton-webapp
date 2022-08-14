import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SymbolChartComponent } from './symbol-chart.component';

describe('SymbolChartComponent', () => {
  let component: SymbolChartComponent;
  let fixture: ComponentFixture<SymbolChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SymbolChartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SymbolChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

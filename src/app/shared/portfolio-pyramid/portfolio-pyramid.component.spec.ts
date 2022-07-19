import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortfolioPyramidComponent } from './portfolio-pyramid.component';

describe('PortfolioPyramidComponent', () => {
  let component: PortfolioPyramidComponent;
  let fixture: ComponentFixture<PortfolioPyramidComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PortfolioPyramidComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PortfolioPyramidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

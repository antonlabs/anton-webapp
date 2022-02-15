import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddToBlacklistComponent } from './add-to-blacklist.component';

describe('AddToBlacklistComponent', () => {
  let component: AddToBlacklistComponent;
  let fixture: ComponentFixture<AddToBlacklistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddToBlacklistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddToBlacklistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LimoUndSaft } from './limo-und-saft';

describe('LimoUndSaft', () => {
  let component: LimoUndSaft;
  let fixture: ComponentFixture<LimoUndSaft>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LimoUndSaft],
    }).compileComponents();

    fixture = TestBed.createComponent(LimoUndSaft);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

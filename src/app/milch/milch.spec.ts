import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Milch } from './milch';

describe('Milch', () => {
  let component: Milch;
  let fixture: ComponentFixture<Milch>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Milch],
    }).compileComponents();

    fixture = TestBed.createComponent(Milch);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Wein } from './wein';

describe('Wein', () => {
  let component: Wein;
  let fixture: ComponentFixture<Wein>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Wein],
    }).compileComponents();

    fixture = TestBed.createComponent(Wein);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

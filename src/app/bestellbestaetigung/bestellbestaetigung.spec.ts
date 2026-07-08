import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Bestellbestaetigung } from './bestellbestaetigung';

describe('Bestellbestaetigung', () => {
  let component: Bestellbestaetigung;
  let fixture: ComponentFixture<Bestellbestaetigung>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Bestellbestaetigung],
    }).compileComponents();

    fixture = TestBed.createComponent(Bestellbestaetigung);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

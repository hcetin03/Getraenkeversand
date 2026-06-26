import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Angebote } from './angebote';

describe('Angebote', () => {
  let component: Angebote;
  let fixture: ComponentFixture<Angebote>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Angebote],
    }).compileComponents();

    fixture = TestBed.createComponent(Angebote);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

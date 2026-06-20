import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Favoriten } from './favoriten';

describe('Favoriten', () => {
  let component: Favoriten;
  let fixture: ComponentFixture<Favoriten>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Favoriten],
    }).compileComponents();

    fixture = TestBed.createComponent(Favoriten);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

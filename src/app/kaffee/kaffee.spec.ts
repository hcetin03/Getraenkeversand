import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Kaffee } from './kaffee';

describe('Kaffee', () => {
  let component: Kaffee;
  let fixture: ComponentFixture<Kaffee>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Kaffee],
    }).compileComponents();

    fixture = TestBed.createComponent(Kaffee);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

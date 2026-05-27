import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Wasser } from './wasser';

describe('Wasser', () => {
  let component: Wasser;
  let fixture: ComponentFixture<Wasser>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Wasser],
    }).compileComponents();

    fixture = TestBed.createComponent(Wasser);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

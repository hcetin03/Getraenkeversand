import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Bier } from './bier';

describe('Bier', () => {
  let component: Bier;
  let fixture: ComponentFixture<Bier>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Bier],
    }).compileComponents();

    fixture = TestBed.createComponent(Bier);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

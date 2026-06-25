import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Jubilaeum } from './jubilaeum';

describe('Jubilaeum', () => {
  let component: Jubilaeum;
  let fixture: ComponentFixture<Jubilaeum>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Jubilaeum],
    }).compileComponents();

    fixture = TestBed.createComponent(Jubilaeum);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

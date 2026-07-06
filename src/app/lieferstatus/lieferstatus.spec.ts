import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Lieferstatus } from './lieferstatus';

describe('Lieferstatus', () => {
  let component: Lieferstatus;
  let fixture: ComponentFixture<Lieferstatus>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Lieferstatus],
    }).compileComponents();

    fixture = TestBed.createComponent(Lieferstatus);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

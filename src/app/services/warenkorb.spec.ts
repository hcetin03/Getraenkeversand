import { TestBed } from '@angular/core/testing';

import { Warenkorb } from './warenkorb';

describe('Warenkorb', () => {
  let service: Warenkorb;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Warenkorb);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

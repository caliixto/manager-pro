import { TestBed } from '@angular/core/testing';

import { Tactica } from './tactica';

describe('Tactica', () => {
  let service: Tactica;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Tactica);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

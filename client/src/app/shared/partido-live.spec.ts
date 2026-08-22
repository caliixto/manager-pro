import { TestBed } from '@angular/core/testing';

import { PartidoLive } from './partido-live';

describe('PartidoLive', () => {
  let service: PartidoLive;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PartidoLive);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

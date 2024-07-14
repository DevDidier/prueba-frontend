import { TestBed } from '@angular/core/testing';

import { CambiarreservaService } from './cambiarreserva.service';

describe('CambiarreservaService', () => {
  let service: CambiarreservaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CambiarreservaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

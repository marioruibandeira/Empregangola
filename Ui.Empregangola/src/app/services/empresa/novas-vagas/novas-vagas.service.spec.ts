import { TestBed } from '@angular/core/testing';

import { NovasVagasService } from './novas-vagas.service';

describe('NovasVagasService', () => {
  let service: NovasVagasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NovasVagasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

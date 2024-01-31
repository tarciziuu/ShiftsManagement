import { TestBed } from '@angular/core/testing';

import { MostProfitableMonthService } from './most-profitable-month.service';

describe('MostProfitableMonthService', () => {
  let service: MostProfitableMonthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MostProfitableMonthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

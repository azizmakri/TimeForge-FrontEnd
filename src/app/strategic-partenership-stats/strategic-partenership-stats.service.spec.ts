import { TestBed } from '@angular/core/testing';

import { StrategicPartenershipStatsService } from './strategic-partenership-stats.service';

describe('StrategicPartenershipStatsService', () => {
  let service: StrategicPartenershipStatsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StrategicPartenershipStatsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

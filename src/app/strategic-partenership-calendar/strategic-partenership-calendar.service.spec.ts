import { TestBed } from '@angular/core/testing';

import { StrategicPartenershipCalendarService } from './strategic-partenership-calendar.service';

describe('StrategicPartenershipCalendarService', () => {
  let service: StrategicPartenershipCalendarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StrategicPartenershipCalendarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { GoalCalendarService } from './goal-calendar.service';

describe('GoalCalendarService', () => {
  let service: GoalCalendarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GoalCalendarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { ProjectCalendarService } from './project-calendar.service';

describe('ProjectCalendarService', () => {
  let service: ProjectCalendarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProjectCalendarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

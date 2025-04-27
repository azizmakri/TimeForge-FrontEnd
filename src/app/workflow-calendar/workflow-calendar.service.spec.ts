import { TestBed } from '@angular/core/testing';

import { WorkflowCalendarService } from './workflow-calendar.service';

describe('WorkflowCalendarService', () => {
  let service: WorkflowCalendarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WorkflowCalendarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

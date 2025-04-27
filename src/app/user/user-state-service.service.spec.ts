import { TestBed } from '@angular/core/testing';

import { UserStateServiceService } from './user-state-service.service';

describe('UserStateServiceService', () => {
  let service: UserStateServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserStateServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { PartnershipService } from './strategicparternship.service';

describe('StrategicparternshipService', () => {
  let service: PartnershipService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PartnershipService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

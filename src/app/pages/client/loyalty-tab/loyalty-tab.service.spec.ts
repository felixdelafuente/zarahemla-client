import { TestBed } from '@angular/core/testing';

import { LoyaltyTabService } from './loyalty-tab.service';

describe('LoyaltyTabService', () => {
  let service: LoyaltyTabService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoyaltyTabService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

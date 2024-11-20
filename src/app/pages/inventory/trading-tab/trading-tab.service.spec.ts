import { TestBed } from '@angular/core/testing';

import { TradingTabService } from './trading-tab.service';

describe('TradingTabService', () => {
  let service: TradingTabService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TradingTabService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

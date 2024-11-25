import { TestBed } from '@angular/core/testing';

import { PurchaseTabService } from './purchase-tab.service';

describe('PurchaseTabService', () => {
  let service: PurchaseTabService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PurchaseTabService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

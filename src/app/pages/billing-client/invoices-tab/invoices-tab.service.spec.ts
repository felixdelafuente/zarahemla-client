import { TestBed } from '@angular/core/testing';

import { InvoicesTabService } from './invoices-tab.service';

describe('InvoicesTabService', () => {
  let service: InvoicesTabService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InvoicesTabService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

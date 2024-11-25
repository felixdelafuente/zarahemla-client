import { TestBed } from '@angular/core/testing';

import { ServiceTabService } from './service-tab.service';

describe('ServiceTabService', () => {
  let service: ServiceTabService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiceTabService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

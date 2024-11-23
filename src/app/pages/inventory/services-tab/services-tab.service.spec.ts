import { TestBed } from '@angular/core/testing';

import { ServicesTabService } from './services-tab.service';

describe('ServicesTabService', () => {
  let service: ServicesTabService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServicesTabService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

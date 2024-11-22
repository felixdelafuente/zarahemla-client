import { TestBed } from '@angular/core/testing';

import { ClientsTabService } from './clients-tab.service';

describe('ClientsTabService', () => {
  let service: ClientsTabService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClientsTabService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

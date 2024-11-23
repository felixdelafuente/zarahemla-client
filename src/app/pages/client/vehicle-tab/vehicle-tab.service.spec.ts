import { TestBed } from '@angular/core/testing';

import { VehicleTabService } from './vehicle-tab.service';

describe('VehicleTabService', () => {
  let service: VehicleTabService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VehicleTabService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

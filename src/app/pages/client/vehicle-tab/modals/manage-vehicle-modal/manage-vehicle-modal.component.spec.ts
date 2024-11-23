import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageVehicleModalComponent } from './manage-vehicle-modal.component';

describe('ManageVehicleModalComponent', () => {
  let component: ManageVehicleModalComponent;
  let fixture: ComponentFixture<ManageVehicleModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageVehicleModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageVehicleModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

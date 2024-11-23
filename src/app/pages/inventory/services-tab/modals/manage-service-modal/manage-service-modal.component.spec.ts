import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageServiceModalComponent } from './manage-service-modal.component';

describe('ManageServiceModalComponent', () => {
  let component: ManageServiceModalComponent;
  let fixture: ComponentFixture<ManageServiceModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageServiceModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageServiceModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

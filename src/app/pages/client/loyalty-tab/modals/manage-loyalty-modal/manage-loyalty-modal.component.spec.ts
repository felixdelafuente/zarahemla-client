import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageLoyaltyModalComponent } from './manage-loyalty-modal.component';

describe('ManageLoyaltyModalComponent', () => {
  let component: ManageLoyaltyModalComponent;
  let fixture: ComponentFixture<ManageLoyaltyModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageLoyaltyModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageLoyaltyModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

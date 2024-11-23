import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteLoyaltyModalComponent } from './delete-loyalty-modal.component';

describe('DeleteLoyaltyModalComponent', () => {
  let component: DeleteLoyaltyModalComponent;
  let fixture: ComponentFixture<DeleteLoyaltyModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteLoyaltyModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteLoyaltyModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

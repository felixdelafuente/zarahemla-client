import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatePaidRecurringModalComponent } from './update-paid-recurring-modal.component';

describe('UpdatePaidRecurringModalComponent', () => {
  let component: UpdatePaidRecurringModalComponent;
  let fixture: ComponentFixture<UpdatePaidRecurringModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdatePaidRecurringModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdatePaidRecurringModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

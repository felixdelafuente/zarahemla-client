import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdjustQuantityModalComponent } from './adjust-quantity-modal.component';

describe('AdjustQuantityModalComponent', () => {
  let component: AdjustQuantityModalComponent;
  let fixture: ComponentFixture<AdjustQuantityModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdjustQuantityModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdjustQuantityModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

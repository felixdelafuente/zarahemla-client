import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageTradingModalComponent } from './manage-trading-modal.component';

describe('ManageTradingModalComponent', () => {
  let component: ManageTradingModalComponent;
  let fixture: ComponentFixture<ManageTradingModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageTradingModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageTradingModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseTabComponent } from './purchase-tab.component';

describe('PurchaseTabComponent', () => {
  let component: PurchaseTabComponent;
  let fixture: ComponentFixture<PurchaseTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PurchaseTabComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PurchaseTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillingClientComponent } from './billing-client.component';

describe('BillingClientComponent', () => {
  let component: BillingClientComponent;
  let fixture: ComponentFixture<BillingClientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BillingClientComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BillingClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

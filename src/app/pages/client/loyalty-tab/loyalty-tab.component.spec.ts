import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoyaltyTabComponent } from './loyalty-tab.component';

describe('LoyaltyTabComponent', () => {
  let component: LoyaltyTabComponent;
  let fixture: ComponentFixture<LoyaltyTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoyaltyTabComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoyaltyTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

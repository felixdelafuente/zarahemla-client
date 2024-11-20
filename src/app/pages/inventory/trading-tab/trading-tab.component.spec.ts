import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TradingTabComponent } from './trading-tab.component';

describe('TradingTabComponent', () => {
  let component: TradingTabComponent;
  let fixture: ComponentFixture<TradingTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TradingTabComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TradingTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

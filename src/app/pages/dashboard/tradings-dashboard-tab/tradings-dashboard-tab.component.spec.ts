import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TradingsDashboardTabComponent } from './tradings-dashboard-tab.component';

describe('TradingsDashboardTabComponent', () => {
  let component: TradingsDashboardTabComponent;
  let fixture: ComponentFixture<TradingsDashboardTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TradingsDashboardTabComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TradingsDashboardTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

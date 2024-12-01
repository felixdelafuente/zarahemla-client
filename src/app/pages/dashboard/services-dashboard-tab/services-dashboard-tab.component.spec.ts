import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicesDashboardTabComponent } from './services-dashboard-tab.component';

describe('ServicesDashboardTabComponent', () => {
  let component: ServicesDashboardTabComponent;
  let fixture: ComponentFixture<ServicesDashboardTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServicesDashboardTabComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServicesDashboardTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

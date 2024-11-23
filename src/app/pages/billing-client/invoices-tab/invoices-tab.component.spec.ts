import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoicesTabComponent } from './invoices-tab.component';

describe('InvoicesTabComponent', () => {
  let component: InvoicesTabComponent;
  let fixture: ComponentFixture<InvoicesTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvoicesTabComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvoicesTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

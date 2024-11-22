import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageClientModalComponent } from './manage-client-modal.component';

describe('ManageClientModalComponent', () => {
  let component: ManageClientModalComponent;
  let fixture: ComponentFixture<ManageClientModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageClientModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageClientModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

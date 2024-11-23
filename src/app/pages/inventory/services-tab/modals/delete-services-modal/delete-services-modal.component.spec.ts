import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteServicesModalComponent } from './delete-services-modal.component';

describe('DeleteServicesModalComponent', () => {
  let component: DeleteServicesModalComponent;
  let fixture: ComponentFixture<DeleteServicesModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteServicesModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteServicesModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

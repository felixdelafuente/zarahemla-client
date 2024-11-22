import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteClientsModalComponent } from './delete-clients-modal.component';

describe('DeleteClientsModalComponent', () => {
  let component: DeleteClientsModalComponent;
  let fixture: ComponentFixture<DeleteClientsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteClientsModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteClientsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

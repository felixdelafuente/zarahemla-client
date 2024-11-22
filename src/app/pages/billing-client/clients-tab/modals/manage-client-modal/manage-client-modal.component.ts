import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ClientsTabService } from '../../clients-tab.service';
import { NewClient } from '../../../../../shared/models/new-client.model';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastService } from '../../../../../core/services/toast.service';

@Component({
  selector: 'app-manage-client-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './manage-client-modal.component.html',
  styleUrl: './manage-client-modal.component.scss'
})
export class ManageClientModalComponent {
  @Input() item: any; // to receive the user object
  @Output() onSave = new EventEmitter<any>(); // to emit save event back to parent component

  manageClientForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private service: ClientsTabService,
    private toastService: ToastService
  ) {
    // Initialize form group with basic fields
    this.manageClientForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required]],
      contact: ['', [Validators.required]],
      dateIssued: ['', [Validators.required]],
    });
  }

  ngOnChanges() {
    if (this.item) {
      this.manageClientForm.patchValue({
        name: this.item.name,
        email: this.item.email,
        contact: this.item.contact,
        dateIssued: this.item.dateIssued,
      });
    }
  }

  onSubmit() {  
      if (this.item) {
        const newService: Partial<any> = {
        name: this.manageClientForm.value.name ,
        email: this.manageClientForm.value.email ,
        contact: this.manageClientForm.value.contact ,
        dateIssued: this.manageClientForm.value.dateIssued ,
      };
        
      this.service.update(this.item._id, newService).subscribe({
        next: (newService) => {
          // Handle success (e.g., show a success message or close the modal)
          this.onSave.emit(newService);
          this.toastService.show('Service updated successfully!', 'success');
        },
        error: (err) => {
          // Handle error (e.g., show an error message)
          this.toastService.show(
          'Failed to update service. Please try again.',
          'danger'
        );
        }
      });
      } else {
        const newService: NewClient = {
      name: this.manageClientForm.value.name ,
      email: this.manageClientForm.value.email ,
      contact: this.manageClientForm.value.contact ,
      dateIssued: this.manageClientForm.value.dateIssued ,
        };
        
      this.service.add(newService).subscribe({
        next: (newService) => {
          // Handle success (e.g., show a success message or close the modal)
          this.onSave.emit(newService);
          this.toastService.show('Client added successfully!', 'success');
        },
        error: (err) => {
          // Handle error (e.g., show an error message)
          this.toastService.show(
          'Failed to add client. Please try again.',
          'danger'
        );
        }
      });
    }
  }
}

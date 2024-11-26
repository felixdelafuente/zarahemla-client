import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ServicesTabService } from '../../services-tab.service';
import { NewService } from '../../../../../shared/models/new-service.model';
import { ToastService } from '../../../../../core/services/toast.service';

@Component({
    selector: 'app-manage-service-modal',
    imports: [
        CommonModule,
        ReactiveFormsModule
    ],
    templateUrl: './manage-service-modal.component.html',
    styleUrl: './manage-service-modal.component.scss'
})
export class ManageServiceModalComponent {
  @Input() item: any; // to receive the user object
  @Output() onSave = new EventEmitter<any>(); // to emit save event back to parent component

  manageServiceForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private service: ServicesTabService,
    private toastService: ToastService
  ) {
    // Initialize form group with basic fields
    this.manageServiceForm = this.fb.group({
      serviceCategory: ['', [Validators.required]],
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      duration: ['', [Validators.required]],
      frequency: ['', [Validators.required]],
      sellingPrice: [0, [Validators.required]]
    });
  }

  ngOnChanges() {
    if (this.item) {
      this.manageServiceForm.patchValue({
        serviceCategory: this.item.category,
        name: this.item.name,
        description: this.item.description,
        duration: this.item.duration,
        frequency: this.item.frequency,
        sellingPrice: this.item.sellingPrice,
      });
    }
  }

  onSubmit() {  
      if (this.item) {
        const newService: Partial<any> = {
        category: this.manageServiceForm.value.serviceCategory ,
        name: this.manageServiceForm.value.name ,
        description: this.manageServiceForm.value.description ,
        duration: this.manageServiceForm.value.duration ,
        frequency: this.manageServiceForm.value.frequency ,
        sellingPrice: this.manageServiceForm.value.sellingPrice ,
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
        const newService: NewService = {
      category: this.manageServiceForm.value.serviceCategory ,
      name: this.manageServiceForm.value.name ,
      description: this.manageServiceForm.value.description ,
      duration: this.manageServiceForm.value.duration ,
      frequency: this.manageServiceForm.value.frequency ,
      sellingPrice: this.manageServiceForm.value.sellingPrice ,
        };
        
      this.service.add(newService).subscribe({
        next: (newService) => {
          // Handle success (e.g., show a success message or close the modal)
          this.onSave.emit(newService);
          this.toastService.show('Service added successfully!', 'success');
        },
        error: (err) => {
          // Handle error (e.g., show an error message)
          this.toastService.show(
          'Failed to add service. Please try again.',
          'danger'
        );
        }
      });
    }
  }
}

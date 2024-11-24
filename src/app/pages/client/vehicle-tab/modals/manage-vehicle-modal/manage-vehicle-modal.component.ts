import { Component, EventEmitter, Input, Output } from '@angular/core';
import { VehicleTabService } from '../../vehicle-tab.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastService } from '../../../../../core/services/toast.service';
import { NewVehicle } from '../../../../../shared/models/new-vehicle.model';

@Component({
  selector: 'app-manage-vehicle-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './manage-vehicle-modal.component.html',
  styleUrl: './manage-vehicle-modal.component.scss'
})
export class ManageVehicleModalComponent {
  @Input() item: any; // to receive the user object
  @Input() clientId: any;
  @Output() onSave = new EventEmitter<any>(); // to emit save event back to parent component

  manageVehicleForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private service: VehicleTabService,
    private toastService: ToastService
  ) {
    // Initialize form group with basic fields
    this.manageVehicleForm = this.fb.group({
      manufacturer: ['', [Validators.required]],
      model: ['', [Validators.required]],
      plateNumber: ['', [Validators.required]],
    });
  }

  ngOnChanges() {
    if (this.item) {
      this.manageVehicleForm.patchValue({
        manufacturer: this.item.manufacturer,
        model: this.item.model,
        plateNumber: this.item.plateNumber
      });
    }
  }

  onSubmit() {  
      if (this.item) {
        const newVehicle: Partial<any> = {
        manufacturer: this.manageVehicleForm.value.manufacturer ,
        model: this.manageVehicleForm.value.model,
        plateNumber: this.manageVehicleForm.value.plateNumber
      };
        
      this.service.update(this.item._id, newVehicle).subscribe({
        next: (newVehicle) => {
          // Handle success (e.g., show a success message or close the modal)
          this.onSave.emit(newVehicle);
          this.toastService.show('Vehicle updated successfully!', 'success');
        },
        error: (err) => {
          // Handle error (e.g., show an error message)
          this.toastService.show(
          'Failed to update vehicle. Please try again.',
          'danger'
        );
        }
      });
      } else {
        const newVehicle: NewVehicle = {
      manufacturer: this.manageVehicleForm.value.manufacturer ,
      model: this.manageVehicleForm.value.model,
      plateNumber: this.manageVehicleForm.value.plateNumber,
      client: this.clientId ,
        };
        
      this.service.add(newVehicle).subscribe({
        next: (newVehicle) => {
          // Handle success (e.g., show a success message or close the modal)
          this.onSave.emit(newVehicle);
          this.toastService.show('Vehicle added successfully!', 'success');
        },
        error: (err) => {
          // Handle error (e.g., show an error message)
          console.log(err);
          this.toastService.show(
          'Failed to add vehicle. Please try again.',
          'danger'
        );
        }
      });
    }
  }
}

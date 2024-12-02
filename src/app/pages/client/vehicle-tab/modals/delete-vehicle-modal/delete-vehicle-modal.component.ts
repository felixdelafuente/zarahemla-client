import { Component, EventEmitter, Input, Output } from '@angular/core';
import { VehicleTabService } from '../../vehicle-tab.service';
import { CommonModule } from '@angular/common';
import * as bootstrap from 'bootstrap';
import { ToastService } from '../../../../../core/services/toast.service';
import { ToastComponent } from '../../../../../shared/components/toast/toast.component';

@Component({
  selector: 'app-delete-vehicle-modal',
  standalone: true,
    imports: [
        CommonModule,
        ToastComponent
    ],
    templateUrl: './delete-vehicle-modal.component.html',
    styleUrl: './delete-vehicle-modal.component.scss'
})
export class DeleteVehicleModalComponent {
  @Input() selectedItems: { ids: string[] } = { ids: [] }; // to receive the object
  @Output() onSave = new EventEmitter<any>(); // to emit save event back to parent component

  constructor(
    private service: VehicleTabService,
    private toastService: ToastService
  ) { }

  onClose() {
    const modalElement = document.getElementById('deleteVehicleModal');
    if (modalElement) {
      const modal = bootstrap.Modal.getInstance(modalElement);
      if (modal) {
        modal.hide(); // Safely hide the modal if an instance exists
      } else {
        console.error("No Bootstrap modal instance found for 'deleteVehicleModal'.");
      }
    } else {
      console.error("Modal element with ID 'deleteVehicleModal' not found.");
    }
  }

  onDelete() {
    this.service.delete(this.selectedItems).subscribe({
      next: (data: any) => {
        this.onSave.emit(data);
        this.toastService.show('Vehicle/s deleted successfully!', 'success');
      },
      error: (msg: any) => {
        console.log("error:", msg);
        this.toastService.show(
          'Failed to delete vehicle/s. Please try again.',
          'danger'
        );
      },
    });
  }
}

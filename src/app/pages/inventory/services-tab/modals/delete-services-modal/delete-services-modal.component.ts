import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ToastComponent } from "../../../../../shared/components/toast/toast.component";
import { CommonModule } from '@angular/common';
import * as bootstrap from 'bootstrap';
import { ServicesTabService } from '../../services-tab.service';
import { ToastService } from '../../../../../core/services/toast.service';

@Component({
  selector: 'app-delete-services-modal',
  standalone: true,
  imports: [
    CommonModule,
    ToastComponent
  ],
  templateUrl: './delete-services-modal.component.html',
  styleUrl: './delete-services-modal.component.scss'
})
export class DeleteServicesModalComponent {
  @Input() selectedItems: { ids: string[] } = { ids: [] }; // to receive the object
  @Output() onSave = new EventEmitter<any>(); // to emit save event back to parent component

  constructor(
    private service: ServicesTabService,
    private toastService: ToastService
  ) { }

  onClose() {
    const modalElement = document.getElementById('deleteServicesModal');
    if (modalElement) {
      const modal = bootstrap.Modal.getInstance(modalElement);
      if (modal) {
        modal.hide(); // Safely hide the modal if an instance exists
      } else {
        console.error("No Bootstrap modal instance found for 'deleteServicesModal'.");
      }
    } else {
      console.error("Modal element with ID 'deleteServicesModal' not found.");
    }
  }

  onDelete() {
    this.service.delete(this.selectedItems).subscribe({
      next: (data: any) => {
        this.onSave.emit(data);
        this.toastService.show('Trading item/s deleted successfully!', 'success');
      },
      error: (msg: any) => {
        console.log("error:", msg);
        this.toastService.show(
          'Failed to delete item/s. Please try again.',
          'danger'
        );
      },
    });
  }
}

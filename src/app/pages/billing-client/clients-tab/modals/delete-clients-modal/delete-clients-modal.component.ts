import { Component, EventEmitter, Input, Output } from '@angular/core';
import * as bootstrap from 'bootstrap';
import { ClientsTabService } from '../../clients-tab.service';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../../../../core/services/toast.service';
import { ToastComponent } from '../../../../../shared/components/toast/toast.component';

@Component({
  selector: 'app-delete-clients-modal',
  standalone: true,
    imports: [
        CommonModule,
        ToastComponent
    ],
    templateUrl: './delete-clients-modal.component.html',
    styleUrl: './delete-clients-modal.component.scss'
})
export class DeleteClientsModalComponent {
  @Input() selectedItems: { ids: string[] } = { ids: [] }; // to receive the object
  @Output() onSave = new EventEmitter<any>(); // to emit save event back to parent component

  constructor(
    private service: ClientsTabService,
    private toastService: ToastService
  ) { }

  onClose() {
    const modalElement = document.getElementById('deleteClientsModal');
    if (modalElement) {
      const modal = bootstrap.Modal.getInstance(modalElement);
      if (modal) {
        modal.hide(); // Safely hide the modal if an instance exists
      } else {
        console.error("No Bootstrap modal instance found for 'deleteClientsModal'.");
      }
    } else {
      console.error("Modal element with ID 'deleteClientsModal' not found.");
    }
  }

  onDelete() {
    this.service.delete(this.selectedItems).subscribe({
      next: (data: any) => {
        this.onSave.emit(data);
        this.toastService.show('Client/s deleted successfully!', 'success');
      },
      error: (msg: any) => {
        console.log("error:", msg);
        this.toastService.show(
          'Failed to delete client/s. Please try again.',
          'danger'
        );
      },
    });
  }
}

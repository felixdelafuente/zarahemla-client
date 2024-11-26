import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ToastService } from '../../../../../core/services/toast.service';
import { TradingTabService } from '../../trading-tab.service';
import { ToastComponent } from "../../../../../shared/components/toast/toast.component";
import * as bootstrap from 'bootstrap';

@Component({
    selector: 'app-delete-items-modal',
    imports: [
        CommonModule,
        ToastComponent
    ],
    templateUrl: './delete-items-modal.component.html',
    styleUrl: './delete-items-modal.component.scss'
})
export class DeleteItemsModalComponent {
  @Input() selectedItems: { ids: string[] } = { ids: [] }; // to receive the object
  @Output() onSave = new EventEmitter<any>(); // to emit save event back to parent component

  constructor(
    private service: TradingTabService,
    private toastService: ToastService
  ) { }

  onClose() {
    const modalElement = document.getElementById('deleteItemsModal');
    if (modalElement) {
      const modal = bootstrap.Modal.getInstance(modalElement);
      if (modal) {
        modal.hide(); // Safely hide the modal if an instance exists
      } else {
        console.error("No Bootstrap modal instance found for 'deleteItemsModal'.");
      }
    } else {
      console.error("Modal element with ID 'deleteItemsModal' not found.");
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

import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import * as bootstrap from 'bootstrap';
import { ToastService } from '../../../../../core/services/toast.service';
import { ToastComponent } from '../../../../../shared/components/toast/toast.component';
import { ServicesTabService } from '../../../../inventory/services-tab/services-tab.service';
import { LoyaltyTabService } from '../../loyalty-tab.service';

@Component({
  selector: 'app-delete-loyalty-modal',
  standalone: true,
    imports: [
        CommonModule,
        ToastComponent
    ],
    templateUrl: './delete-loyalty-modal.component.html',
    styleUrl: './delete-loyalty-modal.component.scss'
})
export class DeleteLoyaltyModalComponent {
  @Input() selectedItems: { ids: string[] } = { ids: [] }; // to receive the object
  @Output() onSave = new EventEmitter<any>(); // to emit save event back to parent component

  constructor(
    private service: LoyaltyTabService,
    private toastService: ToastService
  ) { }

  onClose() {
    const modalElement = document.getElementById('deleteLoyaltyModal');
    if (modalElement) {
      const modal = bootstrap.Modal.getInstance(modalElement);
      if (modal) {
        modal.hide(); // Safely hide the modal if an instance exists
      } else {
        console.error("No Bootstrap modal instance found for 'deleteLoyaltyModal'.");
      }
    } else {
      console.error("Modal element with ID 'deleteLoyaltyModal' not found.");
    }
  }

  onDelete() {
    this.service.delete(this.selectedItems).subscribe({
      next: (data: any) => {
        this.onSave.emit(data);
        this.toastService.show('Discount/s deleted successfully!', 'success');
      },
      error: (msg: any) => {
        console.log("error:", msg);
        this.toastService.show(
          'Failed to delete discount/s. Please try again.',
          'danger'
        );
      },
    });
  }
}

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CashierService } from '../../cashier.service';
import * as bootstrap from 'bootstrap';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../../../core/services/toast.service';
import { ToastComponent } from '../../../../shared/components/toast/toast.component';
import { NewSale } from '../../../../shared/models/new-sale.model';

@Component({
  selector: 'app-confirmation-modal',
  standalone: true,
  imports: [
    CommonModule,
    ToastComponent
  ],
  templateUrl: './confirmation-modal.component.html',
  styleUrl: './confirmation-modal.component.scss'
})
export class ConfirmationModalComponent {
  @Input() checkoutData: NewSale | undefined; // to receive the object
  @Output() onSave = new EventEmitter<any>(); // to emit save event back to parent component

  constructor(
    private service: CashierService,
    private toastService: ToastService
  ) { }

  onClose() {
    const modalElement = document.getElementById('confirmCheckoutModal');
    if (modalElement) {
      const modal = bootstrap.Modal.getInstance(modalElement);
      if (modal) {
        modal.hide(); // Safely hide the modal if an instance exists
      } else {
        console.error("No Bootstrap modal instance found for 'confirmCheckoutModal'.");
      }
    } else {
      console.error("Modal element with ID 'confirmCheckoutModal' not found.");
    }
  }

  onCheckout() {
    if (this.checkoutData) {
      this.service.add(this.checkoutData).subscribe({
      next: (data: any) => {
        this.onSave.emit(data);
        this.toastService.show('Transaction completed successfully!', 'success');
      },
      error: (msg: any) => {
        console.log("error:", msg);
        this.toastService.show(
          'Failed to complete transaction. Please try again.',
          'danger'
        );
      },
    });
    } else {
      this.toastService.show(
          'Failed to load cart data. Please try again.',
          'danger'
        );
    }
  }
}

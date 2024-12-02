import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { InvoicesTabService } from '../../invoices-tab.service';
import { ToastService } from '../../../../../core/services/toast.service';
import { ToastComponent } from "../../../../../shared/components/toast/toast.component";
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NewSale } from '../../../../../shared/models/new-sale.model';
import { CashierService } from '../../../../cashier/cashier.service';

@Component({
  selector: 'app-update-paid-recurring-modal',
  standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ToastComponent,
        ReactiveFormsModule,
    ],
    templateUrl: './update-paid-recurring-modal.component.html',
    styleUrl: './update-paid-recurring-modal.component.scss'
})
export class UpdatePaidRecurringModalComponent {
  @Input() transaction: any; // to receive the user object
  @Output() onSave = new EventEmitter<any>(); 

  paidInput: boolean = false;
  recurringInput: boolean = false;

  recurringCheckout: NewSale | undefined;

  constructor(
    private service: InvoicesTabService,
    private saleService: CashierService,
    private toastService: ToastService
  ) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['transaction'] && changes['transaction'].currentValue) {
      console.log("transaction selected", this.transaction);
      this.paidInput = this.transaction.paid;
      this.recurringInput = this.transaction.recurring;
    }
  }

  getUniqueTransactionNumber(issued: Date): number {
    const now = issued;
  
  // Format date and time to YYYYMMDDHHMMSS (e.g., 20241125123045)
  const transactionNumberString = 
    now.getFullYear().toString() + // YYYY
    (now.getMonth() + 1).toString().padStart(2, '0') + // MM (0-based index, add 1)
    now.getDate().toString().padStart(2, '0') + // DD
    now.getHours().toString().padStart(2, '0') + // HH
    now.getMinutes().toString().padStart(2, '0') + // MM
    now.getSeconds().toString().padStart(2, '0'); // SS

  // Convert the string to a number
  return Number(transactionNumberString);
}

  onSubmit() {
    console.log("transaction selected", this.transaction);
    console.log("input 1", this.paidInput);
    console.log("input 2", this.recurringInput);

    if (this.paidInput && this.recurringInput) {
      console.log(".issued", this.transaction.dateIssued);
      const issued = new Date(this.transaction.dateIssued);
      console.log("issued", issued);
      issued.setMonth(issued.getMonth() + 1);
      console.log("issued next", issued);
      const transactionNumber: number = this.getUniqueTransactionNumber(issued);

      this.recurringCheckout = {
        transactionNumber: transactionNumber,
        branch: this.transaction.branch,
        client: this.transaction.client,
        cart: this.transaction.cart,
        discount: this.transaction.discount ?? 0,
        totalPrice: this.transaction.totalPrice,
        paid: !this.paidInput,
        dateIssued: issued,
        recurring: this.recurringInput
      }

      this.saleService.add(this.recurringCheckout).subscribe({
      next: (data: any) => {
        this.onSave.emit(data);
        this.toastService.show('Recurring transaction for next month has been added successfully!', 'success');
      },
      error: (msg: any) => {
        console.log("error:", msg);
        this.toastService.show(
          'Failed to complete transaction. Please try again.',
          'danger'
        );
      },
    });
    }

    this.service.modifyPaidRecurring(this.transaction._id, this.paidInput, this.recurringInput).subscribe({
        next: (newItem) => {
          // Handle success (e.g., show a success message or close the modal)
          this.onSave.emit(newItem);
          this.toastService.show('Transaction modified successfully!', 'success');
        },
        error: (err) => {
          // Handle error (e.g., show an error message)
          this.toastService.show(
          'Failed to modify transaction. Please try again.',
          'danger'
        );
        }
      });
  }
}

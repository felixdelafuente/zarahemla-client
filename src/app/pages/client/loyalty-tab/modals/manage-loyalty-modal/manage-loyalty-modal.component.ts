import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NewDiscount } from '../../../../../shared/models/new-discount.model';
import { ToastService } from '../../../../../core/services/toast.service';
import { LoyaltyTabService } from '../../loyalty-tab.service';

@Component({
    selector: 'app-manage-loyalty-modal',
    imports: [
        CommonModule,
        ReactiveFormsModule
    ],
    templateUrl: './manage-loyalty-modal.component.html',
    styleUrl: './manage-loyalty-modal.component.scss'
})
export class ManageLoyaltyModalComponent {
  @Input() item: any; // to receive the user object
  @Input() clientId: any;
  @Output() onSave = new EventEmitter<any>(); // to emit save event back to parent component

  manageLoyaltyForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private service: LoyaltyTabService,
    private toastService: ToastService
  ) {
    // Initialize form group with basic fields
    this.manageLoyaltyForm = this.fb.group({
      value: [0, [Validators.required]],
      dateIssued: ['', [Validators.required]],
    });
  }

  ngOnChanges() {
    if (this.item) {
      this.manageLoyaltyForm.patchValue({
        value: this.item.value,
        dateIssued: this.item.dateIssued,
      });
    }
  }

  onSubmit() {  
      if (this.item) {
        const newDiscount: Partial<any> = {
        value: this.manageLoyaltyForm.value.value ,
        dateIssued: this.manageLoyaltyForm.value.dateIssued ,
      };
        
      this.service.update(this.item._id, newDiscount).subscribe({
        next: (newDiscount) => {
          // Handle success (e.g., show a success message or close the modal)
          this.onSave.emit(newDiscount);
          this.toastService.show('Discount updated successfully!', 'success');
        },
        error: (err) => {
          // Handle error (e.g., show an error message)
          this.toastService.show(
          'Failed to update discount. Please try again.',
          'danger'
        );
        }
      });
      } else {
        const newDiscount: NewDiscount = {
      value: this.manageLoyaltyForm.value.value ,
      client: this.clientId ,
      dateIssued: this.manageLoyaltyForm.value.dateIssued ,
        };
        
      this.service.add(newDiscount).subscribe({
        next: (newDiscount) => {
          // Handle success (e.g., show a success message or close the modal)
          this.onSave.emit(newDiscount);
          this.toastService.show('Discount added successfully!', 'success');
        },
        error: (err) => {
          // Handle error (e.g., show an error message)
          console.log(err);
          this.toastService.show(
          'Failed to add discount. Please try again.',
          'danger'
        );
        }
      });
    }
  }
}

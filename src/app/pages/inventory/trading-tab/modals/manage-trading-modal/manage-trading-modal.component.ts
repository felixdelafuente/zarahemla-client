import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TradingTabService } from '../../trading-tab.service';
import { ToastService } from '../../../../../core/services/toast.service';
import { TradingItem } from '../../../../../shared/models/trading-item.model';
import { NewTradingItem } from '../../../../../shared/models/new-trading-item.model';

@Component({
    selector: 'app-manage-trading-modal',
    imports: [
        CommonModule,
        ReactiveFormsModule
    ],
    templateUrl: './manage-trading-modal.component.html',
    styleUrl: './manage-trading-modal.component.scss'
})
export class ManageTradingModalComponent {
  @Input() item: any; // to receive the user object
  @Output() onSave = new EventEmitter<any>(); // to emit save event back to parent component

  manageTradingForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private service: TradingTabService,
    private toastService: ToastService
  ) {
    // Initialize form group with basic fields
    this.manageTradingForm = this.fb.group({
      category: ['', [Validators.required]],
      size: ['', [Validators.required]],
      brand: ['', [Validators.required]],
      description: ['', [Validators.required]],
      quantity: [0, [Validators.required]],
      unit: ['', [Validators.required]],
      sellingPrice: [0, [Validators.required]]
    });
  }

  ngOnChanges() {
    if (this.item) {
      this.manageTradingForm.patchValue({
        category: this.item.category,
        size: this.item.size, // Do not patch password for security reasons
        brand: this.item.brand,
        description: this.item.description,
        quantity: this.item.quantity,
        unit: this.item.unit,
        sellingPrice: this.item.sellingPrice
      });
    }
  }

  onSubmit() {  
      if (this.item) {
        const newItem: Partial<any> = {
        category: this.manageTradingForm.value.category ,
        size: this.manageTradingForm.value.size ,
        brand: this.manageTradingForm.value.brand ,
        description: this.manageTradingForm.value.description ,
        quantity: this.manageTradingForm.value.quantity ,
        unit: this.manageTradingForm.value.unit ,
        sellingPrice: this.manageTradingForm.value.sellingPrice ,
      };
        
      this.service.update(this.item._id, newItem).subscribe({
        next: (newItem) => {
          // Handle success (e.g., show a success message or close the modal)
          this.onSave.emit(newItem);
          this.toastService.show('Item updated successfully!', 'success');
        },
        error: (err) => {
          // Handle error (e.g., show an error message)
          this.toastService.show(
          'Failed to update item. Please try again.',
          'danger'
        );
        }
      });
      } else {
        const newItem: NewTradingItem = {
      category: this.manageTradingForm.value.category ,
      size: this.manageTradingForm.value.size ,
      brand: this.manageTradingForm.value.brand ,
      description: this.manageTradingForm.value.description ,
      quantity: this.manageTradingForm.value.quantity ,
      unit: this.manageTradingForm.value.unit ,
      sellingPrice: this.manageTradingForm.value.sellingPrice ,
        };
        
      this.service.add(newItem).subscribe({
        next: (newItem) => {
          // Handle success (e.g., show a success message or close the modal)
          this.onSave.emit(newItem);
          this.toastService.show('Item added successfully!', 'success');
        },
        error: (err) => {
          // Handle error (e.g., show an error message)
          this.toastService.show(
          'Failed to add item. Please try again.',
          'danger'
        );
        }
      });
    }
  }
}

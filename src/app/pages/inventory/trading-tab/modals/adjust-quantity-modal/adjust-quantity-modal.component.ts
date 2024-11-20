import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ToastComponent } from '../../../../../shared/components/toast/toast.component';
import { TradingItem } from '../../../../../shared/models/trading-item.model';
import { TradingTabService } from '../../trading-tab.service';
import { ToastService } from '../../../../../core/services/toast.service';

@Component({
  selector: 'app-adjust-quantity-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ToastComponent,
    FormsModule,
  ],
  templateUrl: './adjust-quantity-modal.component.html',
  styleUrl: './adjust-quantity-modal.component.scss'
})
export class AdjustQuantityModalComponent {
  @Input() item: TradingItem | undefined = undefined; // to receive the object
  @Output() onSave = new EventEmitter<any>(); // to emit save event back to parent component

  inputQuantity: number = 0;

  constructor(
    private service: TradingTabService,
    private toastService: ToastService
  ) { }

  onSubmit(input: number) {
    if (this.item) {
      console.log('input', input, this.item._id);

      this.service.modifyQuantity(this.item._id, input).subscribe({
        next: (data: any) => {
          this.onSave.emit(data);
          this.inputQuantity = 0;
          this.toastService.show('Modified quantity successfully!', 'success');
      },
      error: (msg: any) => {
        console.log("error:", msg);
        this.toastService.show(
          'Failed to modify quantity. Please try again.',
          'danger'
        );
      },
    });
    }
  }

}

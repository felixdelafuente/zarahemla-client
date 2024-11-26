import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TradingItem } from '../../../../../shared/models/trading-item.model';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../../../../core/services/toast.service';
import { TradingTabService } from '../../trading-tab.service';
import * as bootstrap from 'bootstrap';
import { AdjustQuantityModalComponent } from "../adjust-quantity-modal/adjust-quantity-modal.component";

@Component({
    selector: 'app-low-stock-modal',
    imports: [
        CommonModule,
    ],
    templateUrl: './low-stock-modal.component.html',
    styleUrl: './low-stock-modal.component.scss'
})
export class LowStockModalComponent {
  @Output() onClose = new EventEmitter<any>();
  
  lowStocks: TradingItem[] = [];
  selectedItem: any;

  constructor(
    private service: TradingTabService,
    private toastService: ToastService
  ) { }

  ngOnInit() {
    this.fetchLowStocks();
    console.log("low stocks", this.lowStocks);
  }

  fetchLowStocks() {
    this.service.getLowStocks().subscribe({
      next: (response) => {
        // Extract body data
        this.lowStocks = response;
        console.log('Response body:', this.lowStocks);
      },
      error: (err) => {
        console.error('Error fetching paginated data', err);
      }
    });
  }
}

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastComponent } from '../../../shared/components/toast/toast.component';
import { ToastService } from '../../../core/services/toast.service';
import { TradingTabService } from './trading-tab.service';
import { Pagination } from '../../../shared/models/paginated-result.model';
import * as bootstrap from 'bootstrap';
import { TradingItem } from '../../../shared/models/trading-item.model';
import { BrowserModule } from '@angular/platform-browser';
import { AdjustQuantityModalComponent } from "./modals/adjust-quantity-modal/adjust-quantity-modal.component";
import { ManageTradingModalComponent } from "./modals/manage-trading-modal/manage-trading-modal.component";
import { LowStockModalComponent } from "./modals/low-stock-modal/low-stock-modal.component";
import { DeleteItemsModalComponent } from "./modals/delete-items-modal/delete-items-modal.component";

@Component({
    selector: 'app-trading-tab',
    imports: [
        CommonModule,
        ReactiveFormsModule,
        ToastComponent,
        FormsModule,
        AdjustQuantityModalComponent,
        ManageTradingModalComponent,
        LowStockModalComponent,
        DeleteItemsModalComponent
    ],
    templateUrl: './trading-tab.component.html',
    styleUrl: './trading-tab.component.scss'
})
export class TradingTabComponent {
  paginatedData: TradingItem[] = [];  // Store paginated data
  currentPage: number = 1;
  pageSize: number = 10;  // Adjust the page size
  totalPages: number = 1;
  pageNumbers: number[] = [];
  searchQuery: string = '';

  selectedItems: { ids: string[] } = { ids: [] }; // Store selected item IDs

  selectedItem: any;

  isLow: boolean = false;
  lowStocks: TradingItem[] = [];

  constructor(
    private service: TradingTabService,
    private toastService: ToastService
  ) { }
  
  ngOnInit(): void {
    this.fetchPaginatedData(this.currentPage);
    this.fetchLowStocks();
  }

  fetchPaginatedData(page: number, query?: string) {
    this.service.getPaginated(page, query).subscribe({
      next: (response) => {
        const paginationHeader = response.headers.get('Pagination');
        if (paginationHeader) {
          const pagination: Pagination = JSON.parse(paginationHeader);
          this.currentPage = pagination.currentPage;
          this.totalPages = Math.ceil(pagination.totalItems / this.pageSize);
          this.pageNumbers = Array.from({ length: this.totalPages }, (_, index) => index + 1);
        }

        // Extract body data
        this.paginatedData = response.body;
        console.log('Response body:', this.paginatedData);
        console.log('Pagination data:', paginationHeader);
        console.log('All headers:', response.headers);

      },
      error: (err) => {
        console.error('Error fetching paginated data', err);
      }
    });
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.fetchPaginatedData(page);
    }
  }

  // Check if the item is selected
  isSelected(itemId: string): boolean {
    return this.selectedItems.ids.includes(itemId);
  }

  // Handle checkbox change and update selected items
  onRowCheckboxChange(event: any, itemId: string): void {
    console.log('event', event); 
    console.log('itemId', itemId); 
    if (event.target.checked) {
      // Add item id to selected items
      this.selectedItems.ids.push(itemId);
    } else {
      // Remove item id from selected items
      const index = this.selectedItems.ids.indexOf(itemId);
      if (index > -1) {
        this.selectedItems.ids.splice(index, 1);
      }
    }
    console.log('Selected Items:', this.selectedItems); // You can check the updated selected items here
  }

  fetchLowStocks() {
    this.service.getLowStocks().subscribe({
      next: (response) => {
        // Extract body data
        this.lowStocks = response;
        console.log('Response body:', this.lowStocks);

        if (this.lowStocks.length > 0) {
          this.isLow = true;
        } else {
          this.isLow = false;
        }
      },
      error: (err) => {
        console.error('Error fetching paginated data', err);
      }
    });
  }

  seeLowStocks() {
    const modalElement = document.getElementById('lowStockModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show(); // Manually show the modal
    } else {
      console.error("Modal element with ID 'lowStockModal' not found.");
    }
  }

  onAdd() {
    const modalElement = document.getElementById('manageTradingModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show(); // Manually show the modal
    } else {
      console.error("Modal element with ID 'manageTradingModal' not found.");
    }
  }

  onAddQuantity(item: TradingItem) {
    this.selectedItem = item;

    const modalElement = document.getElementById('adjustQuantityModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show(); // Manually show the modal
    } else {
      console.error("Modal element with ID not found.");
    }
  }

  onSaveQuantity(item: any) {
    // Handle saving the updated data (e.g., make an API call)
    console.log('Updateddata:', item);

    // Close the modal after saving data
    const modalElement = document.getElementById('adjustQuantityModal');
    if (modalElement) {
      const modal = bootstrap.Modal.getInstance(modalElement);
      if (modal) {
        modal.hide(); // Safely hide the modal if an instance exists
        this.fetchPaginatedData(this.currentPage);
      } else {
        console.error("No Bootstrap modal instance found for 'adjustQuantityModal'.");
      }
    } else {
      console.error("Modal element with ID 'adjustQuantityModal' not found.");
    }
  }

  onSave(item: any) {
    // Handle saving the updated data (e.g., make an API call)
    console.log('Updateddata:', item);

    // Close the modal after saving data
    const modalElement = document.getElementById('manageTradingModal');
    if (modalElement) {
      const modal = bootstrap.Modal.getInstance(modalElement);
      if (modal) {
        modal.hide(); // Safely hide the modal if an instance exists
        this.fetchPaginatedData(this.currentPage);
      } else {
        console.error("No Bootstrap modal instance found for 'manageTradingModal'.");
      }
    } else {
      console.error("Modal element with ID 'manageTradingModal' not found.");
    }
  }
  
  onEdit(item: TradingItem) {
    this.selectedItem = item;

    const modalElement = document.getElementById('manageTradingModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show(); // Manually show the modal
    } else {
      console.error("Modal element with ID 'manageTradingModal' not found.");
    }
  }

  onSaveDelete(data: any) {
    // Close the modal after saving data
    const modalElement = document.getElementById('deleteItemsModal');
    if (modalElement) {
      const modal = bootstrap.Modal.getInstance(modalElement);
      if (modal) {
        modal.hide(); // Safely hide the modal if an instance exists
        this.fetchPaginatedData(this.currentPage);
      } else {
        console.error("No Bootstrap modal instance found for 'deleteItemsModal'.");
      }
    } else {
      console.error("Modal element with ID 'deleteItemsModal' not found.");
    }
  }

  onDelete() {
    const modalElement = document.getElementById('deleteItemsModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show(); // Manually show the modal
    } else {
      console.error("Modal element with ID 'deleteItemsModal' not found.");
    }
  }
}

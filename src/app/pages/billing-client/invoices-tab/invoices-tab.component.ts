import { Component } from '@angular/core';
import { InvoicesTabService } from './invoices-tab.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ToastService } from '../../../core/services/toast.service';
import { Pagination } from '../../../shared/models/paginated-result.model';
import { Sale } from '../../../shared/models/sale.model';
import * as bootstrap from 'bootstrap';
import { UpdatePaidRecurringModalComponent } from "./modals/update-paid-recurring-modal/update-paid-recurring-modal.component";

@Component({
    selector: 'app-invoices-tab',
    imports: [
        CommonModule,
        UpdatePaidRecurringModalComponent
    ],
    templateUrl: './invoices-tab.component.html',
    styleUrl: './invoices-tab.component.scss'
})
export class InvoicesTabComponent {
  paginatedData: Sale[] = [];  // Store paginated data
  currentPage: number = 1;
  pageSize: number = 10;  // Adjust the page size
  totalPages: number = 1;
  pageNumbers: number[] = [];
  searchQuery: string = '';

  selectedItems: { ids: string[] } = { ids: [] }; // Store selected item IDs

  selectedItem: any;

  isLow: boolean = false;
  lowStocks: Sale[] = [];

  clientId: string = "";

  constructor(
    private service: InvoicesTabService,
    private toastSale: ToastService,
    private route: ActivatedRoute
  ) { }
  
  ngOnInit(): void {
    this.clientId = this.route.snapshot.paramMap.get('id') || '';

    if (this.clientId != "") {
      console.log("clientId", this.clientId);
      this.fetchPaginatedData(this.currentPage);
    } else {
      this.fetchPaginatedData(this.currentPage);
    }
  }

  fetchPaginatedData(page: number) {
    this.service.getPaginated(page).subscribe({
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

  onEditPaidRecurring(item: Sale) {
    this.selectedItem = item;

    const modalElement = document.getElementById('updatePaidRecurringModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show(); // Manually show the modal
    } else {
      console.error("Modal element with ID 'updatePaidRecurringModal' not found.");
    }
  }

  onSave(item: any) {
    // Handle saving the updated data (e.g., make an API call)
    console.log('Updateddata:', item);

    // Close the modal after saving data
    const modalElement = document.getElementById('updatePaidRecurringModal');
    if (modalElement) {
      const modal = bootstrap.Modal.getInstance(modalElement);
      if (modal) {
        modal.hide(); // Safely hide the modal if an instance exists
        this.fetchPaginatedData(this.currentPage);
      } else {
        console.error("No Bootstrap modal instance found for 'updatePaidRecurringModal'.");
      }
    } else {
      console.error("Modal element with ID 'updatePaidRecurringModal' not found.");
    }
  }
}

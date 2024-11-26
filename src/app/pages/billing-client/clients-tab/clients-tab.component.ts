import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import * as bootstrap from 'bootstrap';
import { ToastComponent } from '../../../shared/components/toast/toast.component';
import { Client } from '../../../shared/models/client.model';
import { Pagination } from '../../../shared/models/paginated-result.model';
import { ClientsTabService } from './clients-tab.service';
import { ToastService } from '../../../core/services/toast.service';
import { DeleteClientsModalComponent } from "./modals/delete-clients-modal/delete-clients-modal.component";
import { ManageClientModalComponent } from "./modals/manage-client-modal/manage-client-modal.component";
import { Router } from '@angular/router';

@Component({
    selector: 'app-clients-tab',
    imports: [
        CommonModule,
        ReactiveFormsModule,
        ToastComponent,
        FormsModule,
        DeleteClientsModalComponent,
        ManageClientModalComponent
    ],
    templateUrl: './clients-tab.component.html',
    styleUrl: './clients-tab.component.scss'
})
export class ClientsTabComponent {
  paginatedData: Client[] = [];  // Store paginated data
  currentPage: number = 1;
  pageSize: number = 10;  // Adjust the page size
  totalPages: number = 1;
  pageNumbers: number[] = [];
  searchQuery: string = '';

  selectedItems: { ids: string[] } = { ids: [] }; // Store selected item IDs

  selectedItem: any;

  isLow: boolean = false;
  lowStocks: Client[] = [];

  constructor(
    private service: ClientsTabService,
    private toastClient: ToastService,
    private router: Router
  ) { }
  
  ngOnInit(): void {
    this.fetchPaginatedData(this.currentPage);
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

  onAdd() {
    const modalElement = document.getElementById('manageClientModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show(); // Manually show the modal
    } else {
      console.error("Modal element with ID 'manageClientModal' not found.");
    }
  }

  onSave(item: any) {
    // Handle saving the updated data (e.g., make an API call)
    console.log('Updateddata:', item);

    // Close the modal after saving data
    const modalElement = document.getElementById('manageClientModal');
    if (modalElement) {
      const modal = bootstrap.Modal.getInstance(modalElement);
      if (modal) {
        modal.hide(); // Safely hide the modal if an instance exists
        this.fetchPaginatedData(this.currentPage);
      } else {
        console.error("No Bootstrap modal instance found for 'manageClientModal'.");
      }
    } else {
      console.error("Modal element with ID 'manageClientModal' not found.");
    }
  }
  
  onEdit(item: Client) {
    this.selectedItem = item;

    const modalElement = document.getElementById('manageClientModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show(); // Manually show the modal
    } else {
      console.error("Modal element with ID 'manageClientModal' not found.");
    }
  }

  onViewClient(item: Client) {
    // sessionStorage.setItem('clientData', JSON.stringify(this.selectedItem));
    this.router.navigateByUrl('/management/billing-client/details/'+ item._id);
  }

  onSaveDelete(data: any) {
    // Close the modal after saving data
    const modalElement = document.getElementById('deleteClientsModal');
    if (modalElement) {
      const modal = bootstrap.Modal.getInstance(modalElement);
      if (modal) {
        modal.hide(); // Safely hide the modal if an instance exists
        this.fetchPaginatedData(this.currentPage);
      } else {
        console.error("No Bootstrap modal instance found for 'deleteClientsModal'.");
      }
    } else {
      console.error("Modal element with ID 'deleteClientsModal' not found.");
    }
  }

  onDelete() {
    const modalElement = document.getElementById('deleteClientsModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show(); // Manually show the modal
    } else {
      console.error("Modal element with ID 'deleteClientsModal' not found.");
    }
  }
}

import { Component } from '@angular/core';
import { Vehicle } from '../../../shared/models/vehicle.model';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import * as bootstrap from 'bootstrap';
import { ToastService } from '../../../core/services/toast.service';
import { ToastComponent } from '../../../shared/components/toast/toast.component';
import { Pagination } from '../../../shared/models/paginated-result.model';
import { VehicleTabService } from './vehicle-tab.service';
import { ManageVehicleModalComponent } from "./modals/manage-vehicle-modal/manage-vehicle-modal.component";
import { DeleteVehicleModalComponent } from "./modals/delete-vehicle-modal/delete-vehicle-modal.component";

@Component({
  selector: 'app-vehicle-tab',
  standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        ToastComponent,
        FormsModule,
        ManageVehicleModalComponent,
        DeleteVehicleModalComponent
    ],
    templateUrl: './vehicle-tab.component.html',
    styleUrl: './vehicle-tab.component.scss'
})
export class VehicleTabComponent {
  paginatedData: Vehicle[] = [];  // Store paginated data
  currentPage: number = 1;
  pageSize: number = 10;  // Adjust the page size
  totalPages: number = 1;
  pageNumbers: number[] = [];
  searchQuery: string = '';

  selectedItems: { ids: string[] } = { ids: [] }; // Store selected item IDs

  selectedItem: any;

  isLow: boolean = false;
  lowStocks: Vehicle[] = [];

  clientId: string = "";

  constructor(
    private service: VehicleTabService,
    private toastVehicle: ToastService,
    private route: ActivatedRoute
  ) { }
  
  ngOnInit(): void {
    this.clientId = this.route.snapshot.paramMap.get('id') || '';

    if (this.clientId != "") {
      console.log("clientId", this.clientId);
      this.fetchPaginatedData(this.currentPage, undefined, this.clientId);
    } else {
      this.fetchPaginatedData(this.currentPage);
    }
  }

  fetchPaginatedData(page: number, query?: string, clientId?: string) {
    this.service.getPaginated(page, query, clientId).subscribe({
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
    const modalElement = document.getElementById('manageVehicleModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show(); // Manually show the modal
    } else {
      console.error("Modal element with ID 'manageVehicleModal' not found.");
    }
  }

  onSave(item: any) {
    // Handle saving the updated data (e.g., make an API call)
    console.log('Updateddata:', item);

    // Close the modal after saving data
    const modalElement = document.getElementById('manageVehicleModal');
    if (modalElement) {
      const modal = bootstrap.Modal.getInstance(modalElement);
      if (modal) {
        modal.hide(); // Safely hide the modal if an instance exists
        this.fetchPaginatedData(this.currentPage);
      } else {
        console.error("No Bootstrap modal instance found for 'manageVehicleModal'.");
      }
    } else {
      console.error("Modal element with ID 'manageVehicleModal' not found.");
    }
  }
  
  onEdit(item: Vehicle) {
    this.selectedItem = item;

    const modalElement = document.getElementById('manageVehicleModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show(); // Manually show the modal
    } else {
      console.error("Modal element with ID 'manageVehicleModal' not found.");
    }
  }

  onSaveDelete(data: any) {
    // Close the modal after saving data
    const modalElement = document.getElementById('deleteVehicleModal');
    if (modalElement) {
      const modal = bootstrap.Modal.getInstance(modalElement);
      if (modal) {
        modal.hide(); // Safely hide the modal if an instance exists
        this.fetchPaginatedData(this.currentPage, undefined, this.clientId);
      } else {
        console.error("No Bootstrap modal instance found for 'deleteVehicleModal'.");
      }
    } else {
      console.error("Modal element with ID 'deleteVehicleModal' not found.");
    }
  }

  onDelete() {
    const modalElement = document.getElementById('deleteVehicleModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show(); // Manually show the modal
    } else {
      console.error("Modal element with ID 'deleteVehicleModal' not found.");
    }
  }
}

import { Component } from '@angular/core';
import { UserManagementService } from './user-management.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NewUser } from '../../shared/models/new-user.model';
import { ToastService } from '../../core/services/toast.service';
import { ToastComponent } from "../../shared/components/toast/toast.component";
import { User } from '../../shared/models/user.model';
import { Pagination } from '../../shared/models/paginated-result.model';
import { ManageUserModalComponent } from "./modals/manage-user-modal/manage-user-modal.component";
import * as bootstrap from 'bootstrap';

@Component({
    selector: 'app-user-management',
    imports: [
        CommonModule,
        ReactiveFormsModule,
        ToastComponent,
        ManageUserModalComponent
    ],
    templateUrl: './user-management.component.html',
    styleUrl: './user-management.component.scss'
})
export class UserManagementComponent {
  addUserForm: FormGroup;

  trading = ["Dashboard Page", "Inventory Page", "Sales Report Page", "User Management", "Cashier Page"];
  services = ["Dashboard Page", "Inventory Page", "Sales Report Page", "User Management", "Cashier Page"];

  selectedTradings: string[] = [];
  selectedServices: string[] = [];

  paginatedData: User[] = [];  // Store paginated data
  currentPage: number = 1;
  pageSize: number = 5;  // Adjust the page size
  totalPages: number = 1;
  pageNumbers: number[] = [];

  selectedUsers: { ids: string[] } = { ids: [] }; // Store selected user IDs

  selectedUser: any;

  constructor(
    private fb: FormBuilder,
    private userService: UserManagementService,
    private toastService: ToastService
  ) {
    // Initialize the reactive form with validation
    this.addUserForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      name: ['', Validators.required],
      accountType: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.fetchPaginatedData(this.currentPage);
  }

  fetchPaginatedData(page: number) {
    this.userService.getPaginated(page).subscribe({
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

  onAccessCheckboxChange(section: string, value: string, event: Event): void {
    // Explicitly typecast the event target
    const isChecked = (event.target as HTMLInputElement).checked;
    const targetArray = section === 'trading' ? this.selectedTradings : this.selectedServices;

    if (isChecked) {
      if (!targetArray.includes(value)) {
        targetArray.push(value);
      }
    } else {
      const index = targetArray.indexOf(value);
      if (index !== -1) {
        targetArray.splice(index, 1);
      }
    }
  }

  // Check if the user is selected
  isSelected(userId: string): boolean {
    return this.selectedUsers.ids.includes(userId);
  }

  // Handle checkbox change and update selected users
  onRowCheckboxChange(event: any, userId: string): void {
    console.log('event', event); 
    console.log('userId', userId); 
    if (event.target.checked) {
      // Add user id to selected users
      this.selectedUsers.ids.push(userId);
    } else {
      // Remove user id from selected users
      const index = this.selectedUsers.ids.indexOf(userId);
      if (index > -1) {
        this.selectedUsers.ids.splice(index, 1);
      }
    }
    console.log('Selected Users:', this.selectedUsers); // You can check the updated selected users here
  }

  onSubmit() {
    console.log('selectedTradings', this.selectedTradings);
    console.log('selectedServices', this.selectedServices);

    const newUser: NewUser = {
      username: this.addUserForm.value.username,
      password: this.addUserForm.value.password,
      name: this.addUserForm.value.name,
      accountType: this.addUserForm.value.accountType,
      access: [
        {
          trading: this.selectedTradings,
          services: this.selectedServices,
        },
      ],
    };

    this.userService.register(newUser).subscribe({
      next: (data: any) => {
        this.toastService.show('User registered successfully!', 'success');
      },
      error: (msg: any) => {
        console.log("error:", msg);
        this.toastService.show(
          'Failed to register user. Please try again.',
          'danger'
        );
      },
    });
  }

  onEditUser(user: any) {
    this.selectedUser = user;

    const modalElement = document.getElementById('manageUserModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show(); // Manually show the modal
    } else {
      console.error("Modal element with ID 'manageUserModal' not found.");
    }
  }

  onSaveUser(updatedUserData: any) {
    // Handle saving the updated user data (e.g., make an API call)
    console.log('Updated user data:', updatedUserData);

    // Close the modal after saving data
    const modalElement = document.getElementById('manageUserModal');
    if (modalElement) {
      const modal = bootstrap.Modal.getInstance(modalElement);
      if (modal) {
        modal.hide(); // Safely hide the modal if an instance exists
      } else {
        console.error("No Bootstrap modal instance found for 'manageUserModal'.");
      }
    } else {
      console.error("Modal element with ID 'manageUserModal' not found.");
    }
  }

  onDeleteUsers() {
    this.userService.delete(this.selectedUsers).subscribe({
      next: (data: any) => {
        this.toastService.show('User/s deleted successfully!', 'success');
        this.fetchPaginatedData(this.currentPage);
      },
      error: (msg: any) => {
        console.log("error:", msg);
        this.toastService.show(
          'Failed to delete user/s. Please try again.',
          'danger'
        );
      },
    });
  }
}

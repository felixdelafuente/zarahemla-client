import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import * as bcrypt from 'bcryptjs';
import { UserManagementService } from '../../user-management.service';
import { ToastService } from '../../../../core/services/toast.service';

@Component({
  selector: 'app-manage-user-modal',
  standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule
    ],
    templateUrl: './manage-user-modal.component.html',
    styleUrl: './manage-user-modal.component.scss'
})
export class ManageUserModalComponent {
  @Input() user: any; // to receive the user object
  @Output() onSave = new EventEmitter<any>(); // to emit save event back to parent component
  
  manageUserForm: FormGroup;
  
  // Static options for trading and services
  trading = ["Dashboard Page", "Inventory Page", "Sales Report Page", "User Management", "Cashier Page"];
  services = ["Dashboard Page", "Inventory Page", "Sales Report Page", "User Management", "Cashier Page"];
  selectedTradings: string[] = [];
  selectedServices: string[] = [];

  constructor(
    private fb: FormBuilder,
    private userService: UserManagementService,
    private toastService: ToastService
  ) {
    // Initialize form group with basic fields
    this.manageUserForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
      currentPassword: ['', []],
      newPassword: ['', []],
      confirmPassword: ['', []],
      name: ['', [Validators.required]],
      accountType: ['', [Validators.required]]
    }, {validators: [this.passwordMatchValidator]});
  }

  ngOnChanges() {
    if (this.user) {
      this.manageUserForm.patchValue({
        username: this.user.username,
        password: '', // Do not patch password for security reasons
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        name: this.user.name,
        accountType: this.user.accountType
      });
      // Set selected trading and service options based on user access
      this.selectedTradings = this.user?.access?.[0]?.trading || [];
      this.selectedServices = this.user?.access?.[0]?.services || [];
    }
  }

  onAccessCheckboxChange(section: string, value: string, event: Event): void {
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

  // Custom validator to check if the new password and confirm password match
  passwordMatchValidator(group: FormGroup) {
    const newPassword = group.get('newPassword');
    const confirmPassword = group.get('confirmPassword');

    if ((newPassword && confirmPassword) && (newPassword.value !== confirmPassword.value)) {
      confirmPassword.setErrors({ passwordMismatch: true });
      this.toastService.show(
          'Confirm Password must match the New Password',
          'danger'
        );
    }
    return null;
  }

  onSubmit() {
      // Prepare the updated user object
    if (this.manageUserForm.value.newPassword || this.manageUserForm.value.currentPassword) {
      const updatedUser: Partial<any> = {
        username: this.manageUserForm.value.username,
        password: this.manageUserForm.value.newPassword || this.manageUserForm.value.currentPassword,
        name: this.manageUserForm.value.name,
        accountType: this.manageUserForm.value.accountType,
        access: [
          {
            trading: this.selectedTradings,
            services: this.selectedServices
          }
        ]
      };

      console.log("error:", updatedUser);

      // Call the update service with the updated user data
      this.userService.update(this.user._id, updatedUser).subscribe({
        next: (updatedUser) => {
          // Handle success (e.g., show a success message or close the modal)
          this.onSave.emit(updatedUser);
          this.toastService.show('User updated successfully!', 'success');
        },
        error: (err) => {
          // Handle error (e.g., show an error message)
          console.error('Error updating user', err);
          this.toastService.show(
          'Failed to update user. Please try again.',
          'danger'
        );
        }
      });
    } else {
      const updatedUser: Partial<any> = {
        username: this.manageUserForm.value.username,
        name: this.manageUserForm.value.name,
        accountType: this.manageUserForm.value.accountType,
        access: [
          {
            trading: this.selectedTradings,
            services: this.selectedServices
          }
        ]
      };

      console.log("error:", updatedUser);

      // Call the update service with the updated user data
      this.userService.update(this.user._id, updatedUser).subscribe({
        next: (updatedUser) => {
          // Handle success (e.g., show a success message or close the modal)
          this.onSave.emit(updatedUser);
          this.toastService.show('User updated successfully!', 'success');
        },
        error: (err) => {
          // Handle error (e.g., show an error message)
          console.error('Error updating user', err);
          this.toastService.show(
          'Failed to update user. Please try again.',
          'danger'
        );
        }
      });
    }
  }
}



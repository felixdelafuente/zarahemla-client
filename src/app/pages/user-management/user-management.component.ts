import { Component } from '@angular/core';
import { UserManagementService } from './user-management.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.scss'
})
export class UserManagementComponent {
  addUserForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private userService: UserManagementService,
    private router: Router
  ) {
    // Initialize the reactive form with validation
    this.addUserForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      name: ['', Validators.required],
      accountType: ['', Validators.required],
    });
  }

  onSubmit() {

  }
}

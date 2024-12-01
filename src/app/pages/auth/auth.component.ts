import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from './auth.service';
import { Credentials } from '../../shared/models/credentials.model';
import { Router } from '@angular/router';
import { ToastService } from '../../core/services/toast.service';

@Component({
    selector: 'app-auth',
    imports: [
        CommonModule,
        ReactiveFormsModule,
    ],
    templateUrl: './auth.component.html',
    styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
  showSplashScreen: boolean = true;  // To control splash screen visibility
  authForm: FormGroup;               // FormGroup for login form
  errorMessage: string | null = null; // To display error messages
  currentUser: any;                 // To store logged-in user details

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService
  ) {
    // Initialize the reactive form with validation
    this.authForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Show splash screen for 3 seconds before showing login form
    setTimeout(() => {
      this.showSplashScreen = false;
      this.checkCurrentUser(); // Check if user is already logged in
    }, 3000); // 3000ms = 3 seconds
  }

  /**
   * Handle login submission
   */
  onLogin(): void {
    if (this.authForm.valid) {
      const creds: Credentials = this.authForm.value;
      this.authService.login(creds).subscribe({
        next: (response: any) => {
          console.log('Login successful:', response);
          this.currentUser = this.authService.getCurrentUser();
          console.log('Current User:', this.currentUser);
          this.router.navigateByUrl('/management/dashboard');
        },
        error: (err: any) => {
          console.error('Login failed:', err);
          this.errorMessage = 'Invalid username or password';
          this.toastService.show(
          this.errorMessage,
          'danger'
        );
        }
      });
    } else {
      this.errorMessage = 'Please fill in all required fields.';
      this.toastService.show(
          this.errorMessage,
          'danger'
        );
    }
  }

  /**
   * Check and get the current user if already logged in
   */
  checkCurrentUser(): void {
    if (this.authService.isAuthenticated()) {
      this.currentUser = this.authService.getCurrentUser();
      console.log('User already logged in:', this.currentUser);
      this.toastService.show(
          "User is already logged in.",
          'success'
        );
    }
  }
}

import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from './auth.service';
import { Credentials } from '../../shared/models/credentials.model';
import { Router } from '@angular/router';
import { ToastService } from '../../core/services/toast.service';
import { Access, Token, User } from '../../shared/models/user.model';

@Component({
  selector: 'app-auth',
  standalone: true,
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
  currentUser: Token | undefined;     // To store logged-in user details
  filteredMenuItems: { title: string; link: string }[] = [];

  menuItems: { title: string; link: string }[] = [
    { title: 'Dashboard', link: 'management/dashboard' },
    { title: 'Inventory', link: 'management/inventory' },
    { title: 'Sales Report', link: 'management/sales' },
    { title: 'Billing & Client', link: 'management/billing-client' },
    { title: 'User Management', link: 'management/users' },
    { title: 'Cashier', link: 'pos/cashier' },
    { title: 'Logout', link: '/' },
  ];

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

    // Subscribe to user changes in constructor
    this.authService.currentUser$.subscribe(user => {
      console.log('User subscription updated:', user);
      this.currentUser = user;
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
        next: (response) => {
          console.log('Login response:', response);
          
          // Check current user after a brief delay to ensure storage is updated
          setTimeout(() => {
            const currentUser = this.authService.getCurrentUser();
            console.log('Current user after login:', currentUser);
            
            if (currentUser) {
              const userAccessTitles = new Set(
                currentUser.access.flatMap((access: Access) => [...access.trading, ...access.services])
              );
          
              this.filteredMenuItems = this.menuItems.filter((menuItem) =>
                userAccessTitles.has(`${menuItem.title} Page`)
              );
              
              this.router.navigateByUrl(this.filteredMenuItems[0].link);
              this.toastService.show('Login successful', 'success');
            } else {
              console.error('User not found after login');
              this.toastService.show('Login successful but user data not found', 'warning');
            }
          }, 100);
        },
        error: (err) => {
          console.error('Login failed:', err);
          this.errorMessage = 'Invalid username or password';
          this.toastService.show(this.errorMessage, 'danger');
        }
      });
    } else {
      this.errorMessage = 'Please fill in all required fields.';
      this.toastService.show(this.errorMessage, 'danger');
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

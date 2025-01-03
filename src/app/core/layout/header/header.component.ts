import { Component } from '@angular/core';
import { AuthService } from '../../../pages/auth/auth.service';
import { Access, User } from '../../../shared/models/user.model';
import { Router } from '@angular/router';

@Component({
    selector: 'app-header',
    standalone: true,
    imports: [],
    templateUrl: './header.component.html',
    styleUrl: './header.component.scss'
})
export class HeaderComponent {
  currentUser: any;
  currentUrl: string | undefined;

  menuItems: { title: string; link: string }[] = [
    { title: 'Dashboard', link: 'management/dashboard' },
    { title: 'Inventory', link: 'management/inventory' },
    { title: 'Sales Report', link: 'management/sales' },
    { title: 'Billing & Client', link: 'management/billing-client' },
    { title: 'User Management', link: 'management/users' },
    { title: 'Cashier', link: 'pos/cashier' },
  ];

  filteredMenuItems: { title: string; link: string }[] = [];

  constructor(
    private authService: AuthService,
    private router: Router,
  ) { }

  ngOnInit(): void {
		// Get initial user state
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.currentUser = currentUser;
      this.filterMenuItemsBasedOnAccess();
    } else {
      // Subscribe to future changes
      this.authService.currentUser$.subscribe((user) => {
        this.currentUser = user;
        this.filterMenuItemsBasedOnAccess();
      });
    }
    
    this.currentUrl = window.location.href;
  }

  filterMenuItemsBasedOnAccess(): void {
		console.log("currentuser", this.currentUser);

    if (!this.currentUser || !this.currentUser.access) {
      console.log("no current user");
      this.filteredMenuItems = [];
      return;
    }

    const userAccessTitles = new Set(
      this.currentUser.access.flatMap((access: Access) => [...access.trading, ...access.services])
		);
		
		console.log("useraccesstitles", userAccessTitles);

    this.filteredMenuItems = this.menuItems.filter((menuItem) =>
      userAccessTitles.has(`${menuItem.title} Page`)
		);
		
		console.log("filteredMenuItems", this.filteredMenuItems);
  }

  onLogout() {
    this.authService.logout();
    this.router.navigateByUrl("/");
  }
}

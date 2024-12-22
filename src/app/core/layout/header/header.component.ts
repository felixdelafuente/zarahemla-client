import { Component } from '@angular/core';
import { AuthService } from '../../../pages/auth/auth.service';
import { Access, User } from '../../../shared/models/user.model';

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
    { title: 'Logout', link: '/' },
  ];

  filteredMenuItems: { title: string; link: string }[] = [];

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
		this.authService.currentUser$.subscribe((user) => {
			console.log("currentuser 1", user);
      this.currentUser = user;
      this.filterMenuItemsBasedOnAccess();
    });
    
    this.currentUrl = window.location.href;
  }

  filterMenuItemsBasedOnAccess(): void {
		console.log("currentuser", this.currentUser);

    if (!this.currentUser || !this.currentUser.access) {
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

    // Ensure Logout always appears in the menu
    this.filteredMenuItems.push({ title: 'Logout', link: '/' });
  }
}

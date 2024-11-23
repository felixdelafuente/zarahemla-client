import { Routes } from '@angular/router';
import { AuthComponent } from './pages/auth/auth.component';
import { LayoutComponent } from './core/layout/layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { UserManagementComponent } from './pages/user-management/user-management.component';
import { InventoryComponent } from './pages/inventory/inventory.component';
import { BillingClientComponent } from './pages/billing-client/billing-client.component';

export const routes: Routes = [
  {
    path: '',
    component: AuthComponent,
    pathMatch: 'full'
  },
  {
    path: 'client',
    component: LayoutComponent,
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent
      },
      {
        path: 'users',
        component: UserManagementComponent
      },
      {
        path: 'inventory',
        component: InventoryComponent
      },
      {
        path: 'billing-client',
        component: BillingClientComponent
      },
    ]
  }
];

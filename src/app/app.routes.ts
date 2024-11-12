import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    // component: 
    pathMatch: 'full'
  },
  {
    path: 'client',
    // component:
    children: [
      {
        path: 'dashboard',
        // component:
      }
    ]
  }
];

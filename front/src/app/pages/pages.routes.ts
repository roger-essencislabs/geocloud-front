import { Routes } from '@angular/router';

export const pagesRoutes: Routes = [

  {
    path: '',
    loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'users',
    loadComponent: () => import('./users/users.component').then(m => m.UsersComponent)
  },
  {
    path: 'profiles',
    loadComponent: () => import('./profiles/profiles.component').then(m => m.ProfilesComponent)
  },  
  // {
  //   path: 'accounts',
  //   component: AccountsComponent, canActivate: [AuthGuard]
  // },
];

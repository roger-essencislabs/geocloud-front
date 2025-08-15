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
  {
    path: 'home-lims',
    loadComponent: () => import('./lims/home-lims/home-lims.component').then(m => m.HomeLimsComponent)
  },  
  {
    path: 'projects',
    loadComponent: () => import('./lims/registrations/projects/projects.component').then(m => m.ProjectsComponent)
  },  
  {
    path: 'projects-type',
    loadComponent: () => import('./lims/registrations/projects-type/projects-type.component').then(m => m.ProjectsTypeComponent)
  }, 
  // {
  //   path: 'accounts',
  //   component: AccountsComponent, canActivate: [AuthGuard]
  // },
];

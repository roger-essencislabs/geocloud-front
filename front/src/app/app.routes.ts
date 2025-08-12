import { Routes } from '@angular/router';
import { pagesRoutes } from './pages/pages.routes';
import { AuthGuard } from './core/guards/auth.guard';
import { accountRoutes } from './account/account.routes';

export const routes: Routes = [

  {
    path: '',
    loadComponent: () => import('./layouts/layout.component').then(m => m.LayoutComponent), 
    children: pagesRoutes,
    canActivate: [AuthGuard] 
  },
  {
    path: 'auth', 
    children: accountRoutes
  }
];

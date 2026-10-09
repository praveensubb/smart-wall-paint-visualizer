import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/landing/landing.component').then(m => m.LandingComponent) },
  { path: 'login', loadComponent: () => import('./pages/auth/login.component').then(m => m.LoginComponent) },
  { path: 'register', loadComponent: () => import('./pages/auth/register.component').then(m => m.RegisterComponent) },
  { path: 'dashboard', loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent), canActivate: [authGuard] },
  { path: 'upload', loadComponent: () => import('./pages/upload/upload.component').then(m => m.UploadComponent), canActivate: [authGuard] },
  { path: 'editor/:id', loadComponent: () => import('./pages/editor/editor.component').then(m => m.EditorComponent), canActivate: [authGuard] },
  { path: 'saved', loadComponent: () => import('./pages/saved/saved.component').then(m => m.SavedComponent), canActivate: [authGuard] },
  { path: 'admin', loadComponent: () => import('./pages/admin/admin.component').then(m => m.AdminComponent), canActivate: [authGuard, adminGuard] },
  { path: 'guide', loadComponent: () => import('./pages/guide/guide.component').then(m => m.GuideComponent) },
  { path: '**', redirectTo: '' }
];

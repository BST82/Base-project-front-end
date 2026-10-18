import { Routes } from '@angular/router';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/landing.component').then((m) => m.LandingComponent),
    title: 'Aura Bistro — Fine Dining & Culinary Experience'
  },
  {
    path: 'menu',
    loadComponent: () => import('./pages/menu.component').then((m) => m.MenuComponent),
    title: 'Artisan Menu — Aura Bistro'
  },
  {
    path: 'reserve',
    loadComponent: () => import('./pages/reservation.component').then((m) => m.ReservationComponent),
    title: 'Reserve a Table — Aura Bistro'
  },
  {
    path: 'locations',
    loadComponent: () => import('./pages/locations.component').then((m) => m.LocationsComponent),
    title: 'Store Locations & Branches — Aura Bistro'
  },
  {
    path: 'stories',
    loadComponent: () => import('./pages/stories.component').then((m) => m.StoriesComponent),
    title: 'Our Stories & Farm Journal — Aura Bistro'
  },
  {
    path: 'reviews',
    loadComponent: () => import('./pages/reviews.component').then((m) => m.ReviewsComponent),
    title: 'Customer Stories & Reviews — Aura Bistro'
  },
  {
    path: 'admin',
    loadComponent: () => import('./pages/admin.component').then((m) => m.AdminComponent),
    canActivate: [adminGuard],
    title: 'Admin Control Center — Aura Bistro'
  },
  {
    path: 'page/:slug',
    loadComponent: () => import('./pages/dynamic-page.component').then((m) => m.DynamicPageComponent),
    title: 'Curated Experience — Aura Bistro'
  },
  {
    path: ':slug',
    loadComponent: () => import('./pages/dynamic-page.component').then((m) => m.DynamicPageComponent),
    title: 'Curated Experience — Aura Bistro'
  },
  {
    path: '**',
    redirectTo: ''
  }
];

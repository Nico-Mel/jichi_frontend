import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AuthComponent } from './auth/auth.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'auth', component: AuthComponent },
  {
    path: 'admin',
    loadComponent: () =>
      import('./admin/admin-layout/admin-layout.component').then(
        (m) => m.AdminLayoutComponent,
      ),
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./admin/dashboard/admin-dashboard.component').then(
            (m) => m.AdminDashboardComponent,
          ),
      },
      {
        path: 'barrios',
        loadComponent: () =>
          import('./admin/barrios/admin-barrios.component').then(
            (m) => m.AdminBarriosComponent,
          ),
      },
      {
        path: 'mapa',
        loadComponent: () =>
          import('./admin/mapa/admin-mapa.component').then(
            (m) => m.AdminMapaComponent,
          ),
      },
      {
        path: 'historial',
        loadComponent: () =>
          import('./admin/historial/admin-historial.component').then(
            (m) => m.AdminHistorialComponent,
          ),
      },
      {
        path: 'usuarios',
        loadComponent: () =>
          import('./admin/usuarios/admin-usuarios.component').then(
            (m) => m.AdminUsuariosComponent,
          ),
      },
    ],
  },
  { path: '**', redirectTo: '' },
];

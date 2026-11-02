import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';

export const routes: Routes = [
  {
    path: 'admin',
    loadChildren: () =>
      import('./components/admin/admin.routes').then((m) => m.adminRoutes),
  },
  { path: ':language?', component: HomeComponent },
  { path: '**', pathMatch: 'full', redirectTo: '/' },
];

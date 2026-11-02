import { Routes } from '@angular/router';
import { authGuard } from '../../guards/auth.guard';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProjectListComponent } from './projects/project-list.component';
import { ProjectFormComponent } from './projects/project-form.component';

export const adminRoutes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: DashboardComponent,
    canActivate: [authGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'projects' },
      { path: 'projects', component: ProjectListComponent },
      { path: 'projects/new', component: ProjectFormComponent },
      { path: 'projects/:id', component: ProjectFormComponent },
    ],
  },
];

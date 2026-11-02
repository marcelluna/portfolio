import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthStore } from '../../../store/auth.store';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
})
export class DashboardComponent {
  private readonly router = inject(Router);
  private readonly authStore = inject(AuthStore);

  logout(): void {
    this.authStore.logout();
    void this.router.navigate(['/admin/login']);
  }
}

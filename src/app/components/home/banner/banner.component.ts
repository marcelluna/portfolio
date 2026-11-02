import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss'],
  imports: [TranslatePipe],
})
export class BannerComponent {
  private readonly router = inject(Router);

  sayHi(): void {
    const contact = 'contact';
    this.router
      .navigate(['/home'])
      .then(() => document.getElementById(contact)?.scrollIntoView({ behavior: 'smooth' }));
  }
}

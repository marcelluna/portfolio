import { Component, HostListener, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { LanguageStore, SupportedLanguage } from '../../../store/language.store';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [RouterLink, NgbNavModule, NgbDropdownModule, TranslatePipe],
})
export class HeaderComponent {
  private readonly router = inject(Router);
  private readonly translateService = inject(TranslateService);
  readonly languageStore = inject(LanguageStore);

  responsiveMenuVisible = false;
  readonly pageYPosition = signal(0);
  cvName = 'Marcel_Luna_DIGIT-TM_II-CV_012025.pdf';

  scroll(el: string): void {
    const element = document.getElementById(el);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else {
      this.router
        .navigate(['/home'])
        .then(() => document.getElementById(el)?.scrollIntoView({ behavior: 'smooth' }));
    }
    this.responsiveMenuVisible = false;
  }

  downloadCV(): void {
    this.translateService.get('header.cv-name').subscribe((val: string) => {
      this.cvName = val;
      const url: string = window.location.href;
      window.open(url + '/../assets/cv/' + this.cvName, '_blank');
    });
  }

  @HostListener('window:scroll')
  getScrollPosition(): void {
    this.pageYPosition.set(window.scrollY);
  }

  changeLanguage(language: SupportedLanguage): void {
    this.languageStore.changeLanguage(language);
  }
}

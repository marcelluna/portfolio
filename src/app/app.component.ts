import { Component, inject, OnInit, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import { filter } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import * as AOS from 'aos';
import { HeaderComponent } from './components/general/header/header.component';
import { FooterComponent } from './components/general/footer/footer.component';
import { LanguageStore } from './store/language/language.store';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
})
export class AppComponent implements OnInit {
  title = 'marcelluna-portfolio';

  private readonly titleService = inject(Title);
  private readonly metaService = inject(Meta);
  private readonly languageStore = inject(LanguageStore);
  private readonly router = inject(Router);

  /** The portfolio header/footer are hidden on the standalone admin pages. */
  readonly showPortfolioChrome = signal(true);

  constructor() {
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe((event) => {
        this.showPortfolioChrome.set(!event.urlAfterRedirects.startsWith('/admin'));
      });
  }

  ngOnInit(): void {
    this.languageStore.initLanguage();

    this.titleService.setTitle('Marcel Luna @ M2L Solutions | FullStack Developer');

    this.metaService.addTags([
      { name: 'keywords', content: 'fullstack, software, developer, java, angular, css' },
      {
        name: 'description',
        content:
          "I have more then 13 years of experience in IT with a Bachelor's Degree in Computer Science and specialization in software engineer but I'm self-taught and like to apply new technologies when they are mature enough and it's the best fit for the project.",
      },
    ]);

    AOS.init();
  }
}

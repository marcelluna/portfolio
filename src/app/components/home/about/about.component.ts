import { Component, inject } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { PortfolioStore } from '../../../store/portfolio/portfolio.store';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
  imports: [TranslatePipe],
})
export class AboutComponent {
  private readonly portfolioStore = inject(PortfolioStore);

  readonly descriptions = this.portfolioStore.aboutMe;
  readonly translationParams = {
    years: new Date().getFullYear() - 2006
  };

}

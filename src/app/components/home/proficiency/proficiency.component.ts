import { Component, inject } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { PortfolioStore } from '../../../store/portfolio/portfolio.store';

const MAX_RATING = 5;

@Component({
  selector: 'app-proficiency',
  templateUrl: './proficiency.component.html',
  styleUrls: ['./proficiency.component.scss'],
  imports: [TranslatePipe],
})
export class ProficiencyComponent {
  private readonly portfolioStore = inject(PortfolioStore);

  readonly categories = this.portfolioStore.proficiency;

  /** Fixed [1..5] scale used to render the star row for a given rating. */
  readonly stars = Array.from({ length: MAX_RATING }, (_, i) => i + 1);
}

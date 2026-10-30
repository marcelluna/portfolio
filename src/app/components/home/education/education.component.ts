import { Component, inject } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { PortfolioStore } from '../../../store/portfolio.store';

@Component({
  selector: 'app-education',
  templateUrl: './education.component.html',
  styleUrls: ['./education.component.scss'],
  imports: [TranslatePipe],
})
export class EducationComponent {
  private readonly portfolioStore = inject(PortfolioStore);

  readonly educations = this.portfolioStore.educations;
}

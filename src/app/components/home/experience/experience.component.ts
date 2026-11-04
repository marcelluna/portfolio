import { Component, inject } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { PortfolioStore } from '../../../store/portfolio/portfolio.store';

@Component({
  selector: 'app-experience',
  templateUrl: './experience.component.html',
  styleUrls: ['./experience.component.scss'],
  imports: [TranslatePipe, NgbNavModule],
})
export class ExperienceComponent {
  private readonly portfolioStore = inject(PortfolioStore);

  active = 0;
  readonly experienceList = this.portfolioStore.experience;
}

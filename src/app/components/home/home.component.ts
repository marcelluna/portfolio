import { Component } from '@angular/core';
import { BannerComponent } from './banner/banner.component';
import { AboutComponent } from './about/about.component';
import { EducationComponent } from './education/education.component';
import { ExperienceComponent } from './experience/experience.component';
import { ProficiencyComponent } from './proficiency/proficiency.component';
import { ProjectsComponent } from './projects/projects.component';
import { ContactComponent } from './contact/contact.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [
    BannerComponent,
    AboutComponent,
    EducationComponent,
    ExperienceComponent,
    ProficiencyComponent,
    ProjectsComponent,
    ContactComponent,
  ],
})
export class HomeComponent {}

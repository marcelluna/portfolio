import { Component, computed, inject } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { LanguageStore, SupportedLanguage } from '../../../store/language.store';
import { ProjectStore } from '../../../store/project.store';
import { ProjectsService } from '../../../services/projects/projects.service';
import { Project } from '../../../model/project.model';

interface ProjectView {
  id: number;
  title: string;
  description: string;
  isGithub: boolean;
  downloadUrl: string;
}

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
  imports: [TranslatePipe],
})
export class ProjectsComponent {
  private readonly projectStore = inject(ProjectStore);
  private readonly languageStore = inject(LanguageStore);
  private readonly projectsService = inject(ProjectsService);

  readonly loading = this.projectStore.loading;
  readonly hasProjects = this.projectStore.hasProjects;

  /** Projects mapped to the active language for display. */
  readonly projects = computed<ProjectView[]>(() => {
    const lang: SupportedLanguage = this.languageStore.language();
    return this.projectStore.projects().map((project: Project) => ({
      id: project.id,
      title: project.title[lang],
      description: project.description[lang],
      isGithub: project.githubUrl !== null,
      downloadUrl: this.projectsService.downloadUrl(project.id),
    }));
  });
}

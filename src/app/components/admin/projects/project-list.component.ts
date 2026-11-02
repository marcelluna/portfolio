import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProjectStore } from '../../../store/project.store';
import { ProjectsService } from '../../../services/projects/projects.service';
import { Project } from '../../../model/project.model';

@Component({
  selector: 'app-admin-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss'],
  imports: [RouterLink],
})
export class ProjectListComponent {
  private readonly projectStore = inject(ProjectStore);
  private readonly projectsService = inject(ProjectsService);

  readonly projects = this.projectStore.projects;
  readonly loading = this.projectStore.loading;
  readonly deletingId = signal<number | null>(null);
  readonly actionError = signal<string | null>(null);

  delete(project: Project): void {
    const label = project.title.en || project.title.pt || `#${project.id}`;
    if (!confirm(`Delete project "${label}"? This cannot be undone.`)) {
      return;
    }
    this.actionError.set(null);
    this.deletingId.set(project.id);
    this.projectsService.remove(project.id).subscribe({
      next: () => {
        this.deletingId.set(null);
        this.projectStore.reload();
      },
      error: () => {
        this.deletingId.set(null);
        this.actionError.set('Failed to delete the project. Please try again.');
      },
    });
  }
}

import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectsService } from '../../../services/projects/projects.service';
import { ProjectStore } from '../../../store/project.store';
import { CreateProjectPayload, UpdateProjectPayload } from '../../../model/project.model';

type SourceType = 'file' | 'github';

@Component({
  selector: 'app-admin-project-form',
  templateUrl: './project-form.component.html',
  styleUrls: ['./project-form.component.scss'],
  imports: [ReactiveFormsModule],
})
export class ProjectFormComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly projectsService = inject(ProjectsService);
  private readonly projectStore = inject(ProjectStore);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly projectId = signal<number | null>(null);
  readonly sourceType = signal<SourceType>('file');
  readonly uploadedFileUrl = signal<string | null>(null);
  readonly uploading = signal(false);
  readonly saving = signal(false);
  readonly error = signal<string | null>(null);

  readonly form = this.formBuilder.group({
    titleEn: ['', Validators.required],
    titlePt: ['', Validators.required],
    descriptionEn: ['', Validators.required],
    descriptionPt: ['', Validators.required],
    githubUrl: [''],
  });

  constructor() {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam && idParam !== 'new') {
      const id = Number(idParam);
      this.projectId.set(id);
      this.loadProject(id);
    }
  }

  private loadProject(id: number): void {
    this.projectsService.getOne(id).subscribe({
      next: (project) => {
        this.form.patchValue({
          titleEn: project.title.en,
          titlePt: project.title.pt,
          descriptionEn: project.description.en,
          descriptionPt: project.description.pt,
          githubUrl: project.githubUrl ?? '',
        });
        if (project.githubUrl) {
          this.sourceType.set('github');
        } else {
          this.sourceType.set('file');
          this.uploadedFileUrl.set(project.fileUrl);
        }
      },
      error: () => this.error.set('Could not load the project.'),
    });
  }

  setSource(type: SourceType): void {
    this.sourceType.set(type);
    this.error.set(null);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) {
      return;
    }
    this.error.set(null);
    this.uploading.set(true);
    this.projectsService.upload(file).subscribe({
      next: (response) => {
        this.uploadedFileUrl.set(response.url);
        this.uploading.set(false);
      },
      error: () => {
        this.uploading.set(false);
        this.error.set('Upload failed. Only PDF and ZIP files (max 25 MB) are allowed.');
      },
    });
  }

  save(): void {
    if (this.form.invalid) {
      return;
    }

    const value = this.form.getRawValue();
    const title = { en: value.titleEn ?? '', pt: value.titlePt ?? '' };
    const description = { en: value.descriptionEn ?? '', pt: value.descriptionPt ?? '' };

    let source: { fileUrl?: string; githubUrl?: string };
    if (this.sourceType() === 'github') {
      const githubUrl = (value.githubUrl ?? '').trim();
      if (!githubUrl) {
        this.error.set('Provide a GitHub URL.');
        return;
      }
      source = { githubUrl };
    } else {
      const fileUrl = this.uploadedFileUrl();
      if (!fileUrl) {
        this.error.set('Upload a file first.');
        return;
      }
      source = { fileUrl };
    }

    this.error.set(null);
    this.saving.set(true);

    const id = this.projectId();
    if (id === null) {
      const payload: CreateProjectPayload = { title, description, ...source };
      this.projectsService.create(payload).subscribe({
        next: () => this.onSaved(),
        error: () => this.onSaveError(),
      });
    } else {
      // Send both source fields so switching source clears the other side.
      const payload: UpdateProjectPayload = {
        title,
        description,
        fileUrl: source.fileUrl ?? null,
        githubUrl: source.githubUrl ?? null,
      };
      this.projectsService.update(id, payload).subscribe({
        next: () => this.onSaved(),
        error: () => this.onSaveError(),
      });
    }
  }

  private onSaved(): void {
    this.saving.set(false);
    this.projectStore.reload();
    void this.router.navigate(['/admin/projects']);
  }

  private onSaveError(): void {
    this.saving.set(false);
    this.error.set('Failed to save the project. Please try again.');
  }

  cancel(): void {
    void this.router.navigate(['/admin/projects']);
  }
}

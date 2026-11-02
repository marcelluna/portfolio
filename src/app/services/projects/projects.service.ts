import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  CreateProjectPayload,
  Project,
  UpdateProjectPayload,
  UploadResponse,
} from '../../model/project.model';

/**
 * Data-access layer for the projects resource of the portfolio-api backend.
 * Reads are public; writes and uploads require the admin JWT (attached by the
 * auth interceptor) and are enforced server-side.
 */
@Injectable({
  providedIn: 'root',
})
export class ProjectsService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.adminApiUrl;

  getAll(): Observable<Project[]> {
    return this.http.get<Project[]>(`${this.baseUrl}/projects`);
  }

  getOne(id: number): Observable<Project> {
    return this.http.get<Project>(`${this.baseUrl}/projects/${id}`);
  }

  create(payload: CreateProjectPayload): Observable<Project> {
    return this.http.post<Project>(`${this.baseUrl}/projects`, payload);
  }

  update(id: number, payload: UpdateProjectPayload): Observable<Project> {
    return this.http.put<Project>(`${this.baseUrl}/projects/${id}`, payload);
  }

  remove(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/projects/${id}`);
  }

  upload(file: File): Observable<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<UploadResponse>(`${this.baseUrl}/uploads`, formData);
  }

  /** Public download endpoint that 302-redirects to the file or GitHub URL. */
  downloadUrl(id: number): string {
    return `${this.baseUrl}/projects/${id}/download`;
  }
}

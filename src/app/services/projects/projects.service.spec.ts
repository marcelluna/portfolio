import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { ProjectsService } from './projects.service';
import { environment } from '../../../environments/environment';
import { CreateProjectPayload } from '../../model/project.model';

describe('ProjectsService', () => {
  let service: ProjectsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(ProjectsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should POST the create payload', () => {
    const payload: CreateProjectPayload = {
      title: { en: 'A', pt: 'A' },
      description: { en: 'B', pt: 'B' },
      githubUrl: 'https://github.com/me/x',
    };
    service.create(payload).subscribe();

    const req = httpMock.expectOne(`${environment.adminApiUrl}/projects`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);
    req.flush({ id: 1, ...payload, fileUrl: null, createdAt: '', updatedAt: '' });
  });

  it('should send a multipart body on upload', () => {
    const file = new File(['data'], 'doc.pdf', { type: 'application/pdf' });
    service.upload(file).subscribe();

    const req = httpMock.expectOne(`${environment.adminApiUrl}/uploads`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body instanceof FormData).toBe(true);
    req.flush({ url: 'x', filename: 'doc.pdf', size: 4, mimeType: 'application/pdf' });
  });

  it('should build the public download URL', () => {
    expect(service.downloadUrl(7)).toBe(`${environment.adminApiUrl}/projects/7/download`);
  });
});

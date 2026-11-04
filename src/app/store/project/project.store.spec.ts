import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { ProjectStore } from './project.store';
import { environment } from '../../../environments/environment';
import { Project } from '../../model/project.model';

const sampleProjects: Project[] = [
  {
    id: 1,
    title: { en: 'My tool', pt: 'Minha ferramenta' },
    description: { en: 'Does things', pt: 'Faz coisas' },
    fileUrl: 'https://api.example.com/uploads/tool.zip',
    githubUrl: null,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
];

describe('ProjectStore', () => {
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should auto-load projects on init', () => {
    const store = TestBed.inject(ProjectStore);
    httpMock.expectOne(`${environment.adminApiUrl}/projects`).flush(sampleProjects);

    expect(store.projects().length).toBe(1);
    expect(store.hasProjects()).toBe(true);
    expect(store.loading()).toBe(false);
  });

  it('should capture an error when the load fails', () => {
    const store = TestBed.inject(ProjectStore);
    httpMock
      .expectOne(`${environment.adminApiUrl}/projects`)
      .flush({ message: 'boom' }, { status: 500, statusText: 'Server Error' });

    expect(store.hasProjects()).toBe(false);
    expect(store.error()).toBe('boom');
  });
});

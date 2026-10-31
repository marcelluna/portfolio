import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';
import { ProjectsComponent } from './projects.component';
import { environment } from '../../../../environments/environment';
import { Project } from '../../../model/project.model';

const projects: Project[] = [
  {
    id: 1,
    title: { en: 'English title', pt: 'Título PT' },
    description: { en: 'English desc', pt: 'Descrição PT' },
    fileUrl: null,
    githubUrl: 'https://github.com/me/x',
    createdAt: '',
    updatedAt: '',
  },
];

describe('ProjectsComponent', () => {
  let fixture: ComponentFixture<ProjectsComponent>;
  let component: ProjectsComponent;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectsComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        provideTranslateService(),
      ],
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(ProjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    httpMock.expectOne(`${environment.adminApiUrl}/projects`).flush(projects);
    fixture.detectChanges();
  });

  afterEach(() => httpMock.verify());

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should map projects to the default (pt) language and expose the download url', () => {
    const view = component.projects();
    expect(view.length).toBe(1);
    expect(view[0].title).toBe('Título PT');
    expect(view[0].isGithub).toBe(true);
    expect(view[0].downloadUrl).toBe(`${environment.adminApiUrl}/projects/1/download`);
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpTestingController } from '@angular/common/http/testing';
import { HomeComponent } from './home.component';
import { commonTestProviders } from '../../../testing/test-providers';
import { environment } from '../../../environments/environment';
import { beforeEach, describe, expect, it } from 'vitest';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [commonTestProviders()],
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    // The embedded projects section auto-loads from the API on init.
    httpMock.match(`${environment.adminApiUrl}/projects`).forEach((req) => req.flush([]));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

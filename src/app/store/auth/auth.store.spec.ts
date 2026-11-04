import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { beforeEach, describe, expect, it, afterEach } from 'vitest';
import { AuthStore } from './auth.store';
import { environment } from '../../../environments/environment';

describe('AuthStore', () => {
  let httpMock: HttpTestingController;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should start unauthenticated', () => {
    const store = TestBed.inject(AuthStore);
    expect(store.isAuthenticated()).toBe(false);
    expect(store.token()).toBeNull();
  });

  it('should store the token and become authenticated on a successful login', () => {
    const store = TestBed.inject(AuthStore);
    store.login({ email: 'me@example.com', password: 'secret' });

    const req = httpMock.expectOne(`${environment.adminApiUrl}/auth/login`);
    expect(req.request.method).toBe('POST');
    req.flush({ accessToken: 'jwt-token' });

    expect(store.token()).toBe('jwt-token');
    expect(store.isAuthenticated()).toBe(true);
    expect(localStorage.getItem('portfolio.admin.token')).toBe('jwt-token');
  });

  it('should surface a friendly error on 401', () => {
    const store = TestBed.inject(AuthStore);
    store.login({ email: 'me@example.com', password: 'wrong' });

    httpMock
      .expectOne(`${environment.adminApiUrl}/auth/login`)
      .flush({ message: 'Unauthorized' }, { status: 401, statusText: 'Unauthorized' });

    expect(store.isAuthenticated()).toBe(false);
    expect(store.error()).toBe('Invalid email or password.');
  });

  it('should clear the session on logout', () => {
    const store = TestBed.inject(AuthStore);
    store.login({ email: 'me@example.com', password: 'secret' });
    httpMock.expectOne(`${environment.adminApiUrl}/auth/login`).flush({ accessToken: 'jwt-token' });

    store.logout();

    expect(store.isAuthenticated()).toBe(false);
    expect(localStorage.getItem('portfolio.admin.token')).toBeNull();
  });
});

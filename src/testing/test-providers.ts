import { EnvironmentProviders, Provider } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

/**
 * Common providers needed to instantiate the portfolio components under test:
 * a router, an HTTP client (with its testing backend) and no-op animations so
 * the Angular animation triggers don't try to run in jsdom.
 */
export function commonTestProviders(): (Provider | EnvironmentProviders)[] {
  return [
    provideRouter([]),
    provideHttpClient(),
    provideHttpClientTesting(),
    provideNoopAnimations(),
  ];
}

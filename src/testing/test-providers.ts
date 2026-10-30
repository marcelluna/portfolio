import { EnvironmentProviders, Provider } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideTranslateService } from '@ngx-translate/core';

/**
 * Common providers needed to instantiate the portfolio components under test:
 * a router, an HTTP client (with its testing backend) and the translate
 * service. The new enter/leave animations are compiler features that TestBed
 * disables automatically, so no animation provider is required.
 */
export function commonTestProviders(): (Provider | EnvironmentProviders)[] {
  return [
    provideRouter([]),
    provideHttpClient(),
    provideHttpClientTesting(),
    provideTranslateService(),
  ];
}

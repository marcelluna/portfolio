import { EnvironmentProviders } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { provideTranslateService, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

export function httpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

/**
 * Configures ngx-translate for a standalone application, loading the locale
 * JSON files from `assets/i18n` over HTTP.
 */
export function provideTranslation(): EnvironmentProviders {
  return provideTranslateService({
    loader: {
      provide: TranslateLoader,
      useFactory: httpLoaderFactory,
      deps: [HttpClient],
    },
  });
}

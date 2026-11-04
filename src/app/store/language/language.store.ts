import { computed, inject } from '@angular/core';
import { Location } from '@angular/common';
import { signalStore, withState, withMethods, withComputed, patchState } from '@ngrx/signals';
import { TranslateService } from '@ngx-translate/core';

export type SupportedLanguage = 'en' | 'pt';

const SUPPORTED_LANGUAGES: SupportedLanguage[] = ['en', 'pt'];
const DEFAULT_LANGUAGE: SupportedLanguage = 'pt';

interface LanguageState {
  language: SupportedLanguage;
}

const initialState: LanguageState = {
  language: DEFAULT_LANGUAGE,
};

function detectBrowserLanguage(): SupportedLanguage {
  const browserLanguage = (navigator.language || '').toLowerCase();
  return browserLanguage.split('-').includes('pt') ? 'pt' : 'en';
}

/**
 * Signal-based store that owns the application language state and keeps
 * ngx-translate and the browser URL in sync with it.
 */
export const LanguageStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed((store) => ({
    isPortuguese: computed(() => store.language() === 'pt'),
    isEnglish: computed(() => store.language() === 'en'),
  })),
  withMethods((store) => {
    const translateService = inject(TranslateService);
    const location = inject(Location);

    function applyLanguage(language: SupportedLanguage): void {
      translateService.setDefaultLang(language);
      // Change the URL without triggering a navigation.
      location.go(language);
      patchState(store, { language });
    }

    return {
      initLanguage(): void {
        translateService.addLangs(SUPPORTED_LANGUAGES);
        applyLanguage(detectBrowserLanguage());
      },
      changeLanguage(language: SupportedLanguage): void {
        applyLanguage(language);
      },
    };
  }),
);

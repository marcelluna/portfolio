import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideTranslateService } from '@ngx-translate/core';
import { LanguageStore } from './language.store';
import { beforeEach, describe, expect, it } from 'vitest';

describe('LanguageStore', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), provideTranslateService()],
    });
  });

  it('should be created with the default language', () => {
    const store = TestBed.inject(LanguageStore);
    expect(store.language()).toBe('pt');
    expect(store.isPortuguese()).toBe(true);
    expect(store.isEnglish()).toBe(false);
  });

  it('should switch language and update the computed flags', () => {
    const store = TestBed.inject(LanguageStore);
    store.changeLanguage('en');
    expect(store.language()).toBe('en');
    expect(store.isEnglish()).toBe(true);
    expect(store.isPortuguese()).toBe(false);
  });

  it('should resolve a supported language after init', () => {
    const store = TestBed.inject(LanguageStore);
    store.initLanguage();
    expect(['en', 'pt']).toContain(store.language());
  });
});

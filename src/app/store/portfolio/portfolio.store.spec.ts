import { TestBed } from '@angular/core/testing';
import { PortfolioStore } from './portfolio.store';
import { beforeEach, describe, expect, it } from 'vitest';

describe('PortfolioStore', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should auto-load the content on init', () => {
    const store = TestBed.inject(PortfolioStore);
    expect(store.aboutMe().length).toBeGreaterThan(0);
    expect(store.experience().length).toBeGreaterThan(0);
    expect(store.educations().length).toBeGreaterThan(0);
  });

  it('should not be loading or in error after a successful load', () => {
    const store = TestBed.inject(PortfolioStore);
    expect(store.loading()).toBe(false);
    expect(store.error()).toBeNull();
    expect(store.isEmpty()).toBe(false);
  });
});

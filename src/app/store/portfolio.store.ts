import { computed, inject } from '@angular/core';
import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { tapResponse } from '@ngrx/operators';
import { forkJoin, pipe, switchMap, tap } from 'rxjs';
import { DataService } from '../services/data/data.service';
import { AboutMe } from '../model/about-me.model';
import { Experience } from '../model/experience.model';
import { Education } from '../model/education.model';

interface PortfolioState {
  aboutMe: AboutMe[];
  experience: Experience[];
  educations: Education[];
  loading: boolean;
  error: string | null;
}

const initialState: PortfolioState = {
  aboutMe: [],
  experience: [],
  educations: [],
  loading: false,
  error: null,
};

/**
 * Owns the portfolio content state (about, experience, education) loaded
 * through the DataService. Built around an async load flow so that moving the
 * content behind the future admin API is a change isolated to DataService.
 */
export const PortfolioStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed((store) => ({
    isEmpty: computed(
      () =>
        store.aboutMe().length === 0 &&
        store.experience().length === 0 &&
        store.educations().length === 0,
    ),
  })),
  withMethods((store) => {
    const dataService = inject(DataService);

    return {
      load: rxMethod<void>(
        pipe(
          tap(() => patchState(store, { loading: true, error: null })),
          switchMap(() =>
            forkJoin({
              aboutMe: dataService.getAboutMe(),
              experience: dataService.getExperience(),
              educations: dataService.getEducations(),
            }).pipe(
              tapResponse({
                next: ({ aboutMe, experience, educations }) =>
                  patchState(store, {
                    aboutMe,
                    experience,
                    educations,
                    loading: false,
                  }),
                error: (error: Error) =>
                  patchState(store, {
                    loading: false,
                    error: error.message ?? 'Failed to load portfolio content',
                  }),
              }),
            ),
          ),
        ),
      ),
    };
  }),
  withHooks({
    onInit(store) {
      store.load();
    },
  }),
);

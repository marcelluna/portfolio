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
import { pipe, switchMap, tap } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { ProjectsService } from '../services/projects/projects.service';
import { Project } from '../model/project.model';

interface ProjectState {
  projects: Project[];
  loading: boolean;
  error: string | null;
}

const initialState: ProjectState = {
  projects: [],
  loading: false,
  error: null,
};

function errorMessage(error: HttpErrorResponse): string {
  return error.error?.message ?? error.message ?? 'Something went wrong.';
}

/**
 * Owns the projects collection. The public site reads it (auto-loaded on
 * init); the admin area mutates it through create/update/remove, each of which
 * refreshes the list on success.
 */
export const ProjectStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed((store) => ({
    hasProjects: computed(() => store.projects().length > 0),
  })),
  withMethods((store) => {
    const projectsService = inject(ProjectsService);

    const load = rxMethod<void>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null })),
        switchMap(() =>
          projectsService.getAll().pipe(
            tapResponse({
              next: (projects) => patchState(store, { projects, loading: false }),
              error: (error: HttpErrorResponse) =>
                patchState(store, { loading: false, error: errorMessage(error) }),
            }),
          ),
        ),
      ),
    );

    return {
      load,
      reload(): void {
        load();
      },
    };
  }),
  withHooks({
    onInit(store) {
      store.load();
    },
  }),
);

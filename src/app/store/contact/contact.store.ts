import { computed, inject } from '@angular/core';

import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';

import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { tapResponse } from '@ngrx/operators';

import { exhaustMap, pipe } from 'rxjs';
import { ContactService } from '../../services/contact/contact.service';
import { ContactRequest } from '../../model/contact-request.model';

export type ContactStatus = 'idle' | 'loading' | 'success' | 'error';

export interface ContactState {
  status: ContactStatus;
}

const initialState: ContactState = {
  status: 'idle',
};

export const ContactStore = signalStore(
  { providedIn: 'root' },

  withState(initialState),

  withComputed(({ status }) => ({
    isLoading: computed(() => status() === 'loading'),
    isMessageSent: computed(() => status() === 'success'),
    isMessageFailed: computed(() => status() === 'error'),
  })),

  withMethods((store, contactService = inject(ContactService)) => ({

    sendEmail: rxMethod<ContactRequest>(
      pipe(
        exhaustMap((request) => {

          patchState(store, { status: 'loading' });

          return contactService.sendMail(request).pipe(
            tapResponse({
              next: () => {
                patchState(store, { status: 'success' });
              },

              error: () => {
                patchState(store, { status: 'error' });
              },
            })
          );
        })
      )
    ),

    reset(): void {
      patchState(store, initialState);
    },

  }))
);

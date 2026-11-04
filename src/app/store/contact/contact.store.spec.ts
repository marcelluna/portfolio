import { TestBed } from '@angular/core/testing';
import { Subject, of, throwError } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ContactStore, ContactRequest } from './contact.store';
import { ContactService } from '../../services/contact/contact.service';

describe('ContactStore', () => {
  let store: InstanceType<typeof ContactStore>;

  const contactRequest: ContactRequest = {
    name: 'John Doe',
    email: 'john@example.com',
    message: 'Hello, this is a test message.',
  };

  const contactServiceMock = {
    sendMail: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();

    TestBed.configureTestingModule({
      providers: [
        ContactStore,
        {
          provide: ContactService,
          useValue: contactServiceMock,
        },
      ],
    });

    store = TestBed.inject(ContactStore);
  });

  describe('Initial state', () => {
    it('should initialize with idle status', () => {
      expect(store.status()).toBe('idle');
    });

    it('should initialize all computed signals as false', () => {
      expect(store.isLoading()).toBe(false);
      expect(store.isMessageSent()).toBe(false);
      expect(store.isMessageFailed()).toBe(false);
    });
  });

  describe('Send email', () => {
    it('should set status to loading while sending an email', () => {
      const response$ = new Subject<void>();

      contactServiceMock.sendMail.mockReturnValue(response$.asObservable());

      store.sendEmail(contactRequest);

      expect(store.status()).toBe('loading');
      expect(store.isLoading()).toBe(true);
      expect(store.isMessageSent()).toBe(false);
      expect(store.isMessageFailed()).toBe(false);

      expect(contactServiceMock.sendMail).toHaveBeenCalledExactlyOnceWith(contactRequest);

      response$.complete();
    });

    it('should set status to success when the email is sent successfully', () => {
      contactServiceMock.sendMail.mockReturnValue(of(undefined));

      store.sendEmail(contactRequest);

      expect(store.status()).toBe('success');
      expect(store.isLoading()).toBe(false);
      expect(store.isMessageSent()).toBe(true);
      expect(store.isMessageFailed()).toBe(false);
    });

    it('should set status to error when sending the email fails', () => {
      contactServiceMock.sendMail.mockReturnValue(
        throwError(() => new Error('HTTP error'))
      );

      store.sendEmail(contactRequest);

      expect(store.status()).toBe('error');
      expect(store.isLoading()).toBe(false);
      expect(store.isMessageSent()).toBe(false);
      expect(store.isMessageFailed()).toBe(true);
    });

    it('should allow a new submission after a successful request', () => {
      const secondResponse$ = new Subject<void>();

      contactServiceMock.sendMail
        .mockReturnValueOnce(of(undefined))
        .mockReturnValueOnce(secondResponse$.asObservable());

      store.sendEmail(contactRequest);

      expect(store.status()).toBe('success');

      store.sendEmail(contactRequest);

      expect(store.status()).toBe('loading');
      expect(store.isMessageSent()).toBe(false);
      expect(contactServiceMock.sendMail).toHaveBeenCalledTimes(2);

      secondResponse$.complete();
    });

    it('should allow a new submission after a failed request', () => {
      const secondResponse$ = new Subject<void>();

      contactServiceMock.sendMail
        .mockReturnValueOnce(
          throwError(() => new Error('HTTP error'))
        )
        .mockReturnValueOnce(secondResponse$.asObservable());

      store.sendEmail(contactRequest);

      expect(store.status()).toBe('error');

      store.sendEmail(contactRequest);

      expect(store.status()).toBe('loading');
      expect(store.isMessageFailed()).toBe(false);
      expect(contactServiceMock.sendMail).toHaveBeenCalledTimes(2);

      secondResponse$.complete();
    });
  });

  describe('Concurrent submissions', () => {
    it('should ignore additional submissions while a request is running', () => {
      const response$ = new Subject<void>();

      contactServiceMock.sendMail.mockReturnValue(response$.asObservable());

      store.sendEmail(contactRequest);
      store.sendEmail(contactRequest);
      store.sendEmail(contactRequest);

      expect(contactServiceMock.sendMail).toHaveBeenCalledTimes(1);
      expect(store.status()).toBe('loading');

      response$.next();
      response$.complete();

      expect(store.status()).toBe('success');
    });

    it('should accept a new submission after the previous request completes', () => {
      const firstResponse$ = new Subject<void>();

      contactServiceMock.sendMail
        .mockReturnValueOnce(firstResponse$.asObservable())
        .mockReturnValueOnce(of(undefined));

      store.sendEmail(contactRequest);

      expect(contactServiceMock.sendMail).toHaveBeenCalledTimes(1);

      firstResponse$.next();
      firstResponse$.complete();

      expect(store.status()).toBe('success');

      store.sendEmail(contactRequest);

      expect(contactServiceMock.sendMail).toHaveBeenCalledTimes(2);
      expect(store.status()).toBe('success');
    });
  });

  describe('Reset state', () => {
    it('should reset the state to idle after success', () => {
      contactServiceMock.sendMail.mockReturnValue(of(undefined));

      store.sendEmail(contactRequest);

      expect(store.status()).toBe('success');

      store.reset();

      expect(store.status()).toBe('idle');
      expect(store.isLoading()).toBe(false);
      expect(store.isMessageSent()).toBe(false);
      expect(store.isMessageFailed()).toBe(false);
    });

    it('should reset the state to idle after failure', () => {
      contactServiceMock.sendMail.mockReturnValue(
        throwError(() => new Error('HTTP error'))
      );

      store.sendEmail(contactRequest);

      expect(store.status()).toBe('error');

      store.reset();

      expect(store.status()).toBe('idle');
      expect(store.isLoading()).toBe(false);
      expect(store.isMessageSent()).toBe(false);
      expect(store.isMessageFailed()).toBe(false);
    });
  });
});

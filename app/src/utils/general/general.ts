import { SerializedError } from '@reduxjs/toolkit';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';

import { ITEMS_PER_PAGE } from '@/constants';

export const classNameHelper = (...args: string[]): string => {
  const classes = args.filter((entry) => entry && entry.trim() !== '');
  return classes.toString().replaceAll(',', ' ').trim();
};

export const createDynamicArray = (value: number) => {
  return Array.from(Array(Math.abs(value)).keys()) as number[];
};

export const createPaginationShowList = (numberOfItems: number) => {
  const items = numberOfItems < 0 ? 0 : numberOfItems;
  return createDynamicArray(Math.floor(items / ITEMS_PER_PAGE) + 1).map((i) => {
    const value = (i + 1) * ITEMS_PER_PAGE;
    return { label: `Show ${value}`, value: `${value}` };
  });
};

export const localStorageHelper = <T>(key: string) => {
  const getValue = (key: string): string | null => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      return null;
    }
  };

  const setValue = (value: T) => {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(value));
      }
    } catch (error) {
      console.log('localStorageHelper.setValue: ', error);
    }
  };
  return [setValue, getValue] as const;
};

export const normalizeError = (
  error:
    | Partial<FetchBaseQueryError>
    | SerializedError
    | { error: string }
    | undefined
) => {
  if (error === undefined) {
    return { id: '-1', message: 'Undefined Error occurred!' };
  }
  let message = '';

  if ('status' in error && typeof error.status === 'string') {
    message = `${error.status} | `;
  }

  if ('error' in error) {
    message += `${error.error} | `;
  }

  if ('data' in error && typeof error.data === 'string') {
    message += `${error.data}.`;
  }

  if (
    'data' in error &&
    typeof error.data === 'object' &&
    'message' in (error.data as { message: 'string' })
  ) {
    message += `${(error.data as { message: 'string' }).message}.`;
  }

  if (message.trim().length === 0) {
    message = 'Unknown Error Happen no additional data!';
  }

  return { id: crypto.randomUUID(), message: message.trim() };
};

export const formatDate = (date: string | Date) => {
  if (typeof date === 'string') {
    const dateObject = Date.parse(date) > 0 ? new Date(date) : new Date();
    return new Intl.DateTimeFormat('de-AT').format(dateObject);
  }

  return new Intl.DateTimeFormat('de-AT').format(date);
};

import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { expect } from 'vitest';

import {
  classNameHelper,
  createDynamicArray,
  createPaginationShowList,
  formatDate,
  localStorageHelper,
  normalizeError
} from './general';

const RANDOM_ID = 'random-id';

describe('General utils test', () => {
  Object.defineProperty(window, 'crypto', {
    value: { randomUUID: () => RANDOM_ID }
  });

  describe('classNameHelper utils function', () => {
    it('should return string from arguments array', () => {
      expect(classNameHelper('')).toEqual('');
      expect(classNameHelper(' ')).toEqual('');
      expect(classNameHelper()).toEqual('');
      expect(classNameHelper('test')).toEqual('test');
      expect(classNameHelper('test', 'test_1', 'test_2')).toEqual(
        'test test_1 test_2'
      );
      expect(classNameHelper('test', ' ', 'test_2')).toEqual('test test_2');
      expect(classNameHelper('test', '    ', '', 'test_2')).toEqual(
        'test test_2'
      );
      expect(classNameHelper('test', ' ', '', '  ', 'test_2   ', '')).toEqual(
        'test test_2'
      );
    });
  });

  describe('createDynamicArray utils function', () => {
    it('should return array with elements', () => {
      expect(createDynamicArray(-1)).toEqual([0]);
      expect(createDynamicArray(0)).toEqual([]);
      expect(createDynamicArray(3)).toEqual([0, 1, 2]);
    });
  });

  describe('createPaginationShowList utils function', () => {
    it('should return array with elements that have label and name', () => {
      expect(createPaginationShowList(-10)).toEqual([
        { label: 'Show 5', value: '5' }
      ]);
      expect(createPaginationShowList(-1)).toEqual([
        { label: 'Show 5', value: '5' }
      ]);
      expect(createPaginationShowList(0)).toEqual([
        { label: 'Show 5', value: '5' }
      ]);
      expect(createPaginationShowList(1)).toEqual([
        { label: 'Show 5', value: '5' }
      ]);
      expect(createPaginationShowList(4)).toEqual([
        { label: 'Show 5', value: '5' }
      ]);
      expect(createPaginationShowList(5)).toEqual([
        { label: 'Show 5', value: '5' },
        { label: 'Show 10', value: '10' }
      ]);
      expect(createPaginationShowList(5)).toEqual([
        { label: 'Show 5', value: '5' },
        { label: 'Show 10', value: '10' }
      ]);
      expect(createPaginationShowList(9)).toEqual([
        { label: 'Show 5', value: '5' },
        { label: 'Show 10', value: '10' }
      ]);
      expect(createPaginationShowList(35).length).toEqual(35 / 5 + 1);
    });
  });

  describe('localStorageHelper utils function', () => {
    const mockGetItem = vi.fn();
    const mockSetItem = vi.fn();
    const realLocalStorage = window.localStorage;
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: mockGetItem,
        setItem: mockSetItem
      }
    });

    afterAll(() => {
      Object.defineProperty(window, 'localStorage', realLocalStorage);
    });

    it('should call localStorage functions', () => {
      const [setValue, getValue] = localStorageHelper('test');
      setValue(null);
      getValue('test');

      expect(mockSetItem).toHaveBeenCalledWith('test', 'null');
      expect(mockGetItem).toHaveBeenCalledWith('test');
    });
  });

  describe('normalizeError utils function', () => {
    const errorMock: Partial<FetchBaseQueryError> = {
      status: 'CUSTOM_ERROR',
      data: { message: 'Some data' },
      error: 'Some error'
    };

    it('should return default error message if error is undefined', () => {
      expect(normalizeError(undefined)).toEqual({
        id: '-1',
        message: 'Undefined Error occurred!'
      });
    });

    it('should return all the data from error', () => {
      expect(normalizeError(errorMock)).toEqual({
        id: RANDOM_ID,
        message: 'CUSTOM_ERROR | Some error | Some data.'
      });
    });

    it('should remove Some data. from error message', () => {
      delete errorMock.data;
      expect(normalizeError(errorMock)).toEqual({
        id: RANDOM_ID,
        message: 'CUSTOM_ERROR | Some error |'
      });
    });

    it('should remove Some error from error message', () => {
      delete errorMock.error;
      expect(normalizeError(errorMock)).toEqual({
        id: RANDOM_ID,
        message: 'CUSTOM_ERROR |'
      });
    });

    it('should return general message if ', () => {
      delete errorMock.status;
      expect(normalizeError(errorMock)).toEqual({
        id: RANDOM_ID,
        message: 'Unknown Error Happen no additional data!'
      });
    });
  });

  describe('formatDate utils function', () => {
    it('should return formate date', () => {
      const dateString = '1995-12-17T03:24:00';
      const date = new Date(dateString);
      const currentFormattedDate = new Intl.DateTimeFormat('de-AT').format(
        new Date()
      );

      expect(formatDate(dateString)).toEqual('17.12.1995');
      expect(formatDate(date)).toEqual('17.12.1995');
      expect(formatDate('')).toEqual(currentFormattedDate);
      expect(formatDate('     ')).toEqual(currentFormattedDate);
      expect(formatDate('some not valid date')).toEqual(currentFormattedDate);
    });
  });
});

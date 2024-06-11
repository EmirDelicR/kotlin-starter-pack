import { expect, vi } from 'vitest';

import { createStore } from '@/store';
import { setUser } from '@/store/userSlice';

import { INITIAL_USER_DATA, logoutUser } from './userStoreSlice';

const mockSetData = vi.fn();

vi.mock('@/utils', async () => ({
  ...(await vi.importActual<Record<string, unknown>>('@/utils')),
  localStorageHelper: () => [mockSetData, vi.fn()]
}));

describe('userStoreSLice redux state', () => {
  const store = createStore();

  beforeEach(() => {
    mockSetData.mockReset();
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  it('Should set initial data for user', () => {
    const userState = store.getState().user;

    expect(userState).toEqual(INITIAL_USER_DATA);
  });

  it('Should set data for user and call setToken from localStorageHelper', () => {
    store.dispatch(
      setUser({ data: { ...INITIAL_USER_DATA.data, token: 'token' } })
    );
    const userState = store.getState().user;

    expect(mockSetData).toHaveBeenCalledWith('token');
    expect(userState).toEqual({
      data: { ...INITIAL_USER_DATA.data, token: 'token' }
    });
  });

  it('Should set initial user data, token to null and logout user', () => {
    store.dispatch(logoutUser());
    const userState = store.getState().user;

    expect(mockSetData).toHaveBeenCalledWith(null);
    expect(userState).toEqual(INITIAL_USER_DATA);
  });
});

import { waitFor } from '@testing-library/react';
import { expect, vi } from 'vitest';

import useAutoLogin from '@/hooks/useAutoLogin';
import { renderHookWithProviders } from '@/utils/test/testUtils';

const mockGetTokenData = vi.fn();
const mockAutoLogin = vi.fn();
const mockDispatch = vi.fn();
const mockNavigate = vi.fn();

vi.mock('@/utils', async () => ({
  ...(await vi.importActual<Record<string, unknown>>('@/utils')),
  localStorageHelper: () => [vi.fn(), mockGetTokenData]
}));

vi.mock('react-router-dom', async () => ({
  ...(await vi.importActual<Record<string, unknown>>('react-router-dom')),
  useNavigate: () => mockNavigate
}));

vi.mock('@/features/auth/store/authApiSlice', async () => ({
  ...(await vi.importActual<Record<string, unknown>>(
    '@/features/auth/store/authApiSlice'
  )),
  useAutoLoginMutation: () => [mockAutoLogin]
}));

vi.mock('@/store', async () => ({
  ...(await vi.importActual<Record<string, unknown>>('@/store')),
  useAppDispatch: () => mockDispatch
}));

vi.mock('@/store/userSlice', async () => ({
  ...(await vi.importActual<Record<string, unknown>>('@/store/userSlice')),
  setUser: vi.fn().mockReturnValue('user')
}));

describe('useAutoLogin hook test', () => {
  beforeEach(() => {
    mockGetTokenData.mockReset().mockReturnValue('token');
    mockAutoLogin.mockReset().mockResolvedValue({ data: { status: 200 } });
    mockDispatch.mockReset();
    mockNavigate.mockReset();
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  it('Should return false and not call dispatch and setUser if token is not set', async () => {
    mockGetTokenData.mockReturnValue(null);
    const { result } = renderHookWithProviders(() => useAutoLogin(false));

    await waitFor(() => {
      expect(mockGetTokenData).toHaveBeenCalledTimes(1);
      expect(mockAutoLogin).toHaveBeenCalledTimes(0);
      expect(mockDispatch).toHaveBeenCalledTimes(0);
      expect(result.current).eq(false);
    });
  });

  it('Should return false and not call dispatch and setUser if response status is not 200', async () => {
    mockAutoLogin.mockResolvedValue({ data: { status: 400 } });
    const { result } = renderHookWithProviders(() => useAutoLogin(false));

    await waitFor(() => {
      expect(mockGetTokenData).toHaveBeenCalledTimes(1);
      expect(mockAutoLogin).toHaveBeenCalledTimes(1);
      expect(mockDispatch).toHaveBeenCalledTimes(0);
      expect(result.current).eq(false);
    });
  });

  it('Should return true and call dispatch and setUser if response status is 200', async () => {
    const { result } = renderHookWithProviders(() => useAutoLogin(false));

    await waitFor(() => {
      expect(mockGetTokenData).toHaveBeenCalledTimes(1);
      expect(mockAutoLogin).toHaveBeenCalledTimes(1);
      expect(mockDispatch).toHaveBeenCalledTimes(1);
      expect(result.current).eq(true);
    });
  });

  it('Should return true if user is already logged in', async () => {
    const { result } = renderHookWithProviders(() => useAutoLogin(true));

    await waitFor(() => {
      expect(mockGetTokenData).toHaveBeenCalledTimes(1);
      expect(mockAutoLogin).toHaveBeenCalledTimes(0);
      expect(mockDispatch).toHaveBeenCalledTimes(0);
      expect(result.current).eq(true);
    });
  });
});

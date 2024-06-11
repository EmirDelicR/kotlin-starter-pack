import { renderHook } from '@testing-library/react';
import { expect, vi } from 'vitest';

import { User, UserResponse } from '@/store/userSlice';

import useAuth from './useAuth';

const mockDispatch = vi.fn();
const mockNavigate = vi.fn();

vi.mock('@/store', async () => ({
  ...(await vi.importActual<Record<string, unknown>>('@/store')),
  useAppDispatch: () => mockDispatch
}));

vi.mock('react-router-dom', async () => ({
  ...(await vi.importActual<Record<string, unknown>>('react-router-dom')),
  useNavigate: () => mockNavigate
}));

const MOCK_DATA: UserResponse = {
  data: {} as User,
  status: 200
};

describe('useAuth hook test', () => {
  beforeEach(() => {
    mockDispatch.mockReset();
    mockNavigate.mockReset();
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  it('should call dispatch and navigate if request is successfully done and data is present', () => {
    renderHook(() => useAuth(MOCK_DATA, true));

    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith('/home');
  });

  it('should not call dispatch and navigate if request is successfully done and data is not present', () => {
    renderHook(() => useAuth(undefined, true));

    expect(mockDispatch).toHaveBeenCalledTimes(0);
    expect(mockNavigate).toHaveBeenCalledTimes(0);
  });

  it('should not call dispatch and navigate if request is not successfully done and data is present', () => {
    renderHook(() => useAuth(MOCK_DATA, false));

    expect(mockDispatch).toHaveBeenCalledTimes(0);
    expect(mockNavigate).toHaveBeenCalledTimes(0);
  });

  it('should not call dispatch and navigate if request is not successfully done and data is not present', () => {
    renderHook(() => useAuth(undefined, false));

    expect(mockDispatch).toHaveBeenCalledTimes(0);
    expect(mockNavigate).toHaveBeenCalledTimes(0);
  });
});

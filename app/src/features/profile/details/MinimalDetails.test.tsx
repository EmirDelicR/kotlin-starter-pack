import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, vi } from 'vitest';

import { NavRoutes } from '@/constants';
import { INITIAL_USER_DATA } from '@/store/userSlice';
import { renderWithProviders } from '@/utils/test/testUtils';

import MinimalDetails from './MinimalDetails';

const DATA = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@doe.com'
};

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

describe('<MinimalDetails/>', () => {
  const PRELOADED_STATE = {
    user: {
      data: {
        ...INITIAL_USER_DATA.data,
        ...DATA
      }
    }
  };

  afterAll(() => {
    vi.restoreAllMocks();
  });

  describe('Layout test', () => {
    it('should render element', () => {
      renderWithProviders(<MinimalDetails />, {
        preloadedState: PRELOADED_STATE
      });

      expect(
        screen.getByText(`${DATA.firstName} ${DATA.lastName}`)
      ).toBeInTheDocument();
      expect(screen.getByText(`${DATA.email}`)).toBeInTheDocument();
      expect(screen.getByText('Edit Profile')).toBeInTheDocument();
      expect(screen.getByText('Logout')).toBeInTheDocument();
    });
  });

  describe('Logout user test', () => {
    beforeEach(() => {
      mockDispatch.mockReset();
      mockNavigate.mockReset();
    });

    it('should logout user', async () => {
      renderWithProviders(<MinimalDetails />, {
        preloadedState: PRELOADED_STATE
      });

      await userEvent.click(screen.getByText('Logout'));

      expect(mockDispatch).toHaveBeenCalledTimes(1);
      expect(mockNavigate).toHaveBeenCalledWith(`/${NavRoutes.AUTH}`);
    });
  });
});

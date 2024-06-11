import { screen } from '@testing-library/react';
import { expect } from 'vitest';

import { NavRouteNames, Roles } from '@/constants';
import { INITIAL_USER_DATA } from '@/store/userSlice';
import { renderWithProviders } from '@/utils/test/testUtils';

import NavBar from './NavBar';

const USER_ID = 'user-id';
const PRELOADED_STATE = {
  user: {
    data: {
      ...INITIAL_USER_DATA.data,
      id: USER_ID
    }
  }
};

const location = {
  pathname: '/work'
};

vi.mock('react-router-dom', async () => ({
  ...(await vi.importActual<Record<string, unknown>>('react-router-dom')),
  useLocation: () => location
}));

describe('<NavBar/>', () => {
  afterAll(() => {
    vi.restoreAllMocks();
  });

  describe('Layout test', () => {
    it('should render only user routes', () => {
      renderWithProviders(<NavBar />, { preloadedState: PRELOADED_STATE });

      expect(screen.getByText(NavRouteNames.HOME)).toBeInTheDocument();
      expect(screen.getByText(NavRouteNames.WORK)).toBeInTheDocument();
      expect(screen.getByText(NavRouteNames.PROFILE)).toBeInTheDocument();
    });

    it('should render only admin routes if user is admin', () => {
      const PRELOADED_STATE_ADMIN = {
        user: {
          data: {
            ...INITIAL_USER_DATA.data,
            id: USER_ID,
            role: { type: Roles.ADMIN }
          }
        }
      };
      renderWithProviders(<NavBar />, {
        preloadedState: PRELOADED_STATE_ADMIN
      });

      expect(screen.getByText(NavRouteNames.HOME)).toBeInTheDocument();
      expect(screen.getByText(NavRouteNames.WORK)).toBeInTheDocument();
      expect(screen.getByText(NavRouteNames.PROFILE)).toBeInTheDocument();
      expect(screen.getByText(NavRouteNames.EMAILS)).toBeInTheDocument();
    });

    it('should set active link depend on location', () => {
      renderWithProviders(<NavBar />, { preloadedState: PRELOADED_STATE });

      const workLink = screen.getByText(NavRouteNames.WORK).parentElement!;

      expect(workLink.classList.contains('linkActive')).toBeTruthy();
    });
  });
});

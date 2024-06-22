import { screen } from '@testing-library/react';
import { expect, vi } from 'vitest';

import { Roles } from '@/constants';
import { INITIAL_USER_DATA } from '@/store/userSlice';
import { renderWithProviders } from '@/utils/test/testUtils';

import ProfileDetails from './ProfileDetails';

const DATA = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@doe.com',
  userName: 'Cabal',
  age: 25
};

describe('<ProfileDetails/>', () => {
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
      renderWithProviders(<ProfileDetails />, {
        preloadedState: PRELOADED_STATE
      });

      expect(screen.getByText('Full name:')).toBeInTheDocument();
      expect(
        screen.getByText(`${DATA.firstName} ${DATA.lastName}`)
      ).toBeInTheDocument();
      expect(screen.getByText('User name:')).toBeInTheDocument();
      expect(screen.getByText(`${DATA.userName}`)).toBeInTheDocument();
      expect(screen.getByText('Email:')).toBeInTheDocument();
      expect(screen.getByText(`${DATA.email}`)).toBeInTheDocument();
      expect(screen.getByText('Age:')).toBeInTheDocument();
      expect(screen.getByText(`${DATA.age}`)).toBeInTheDocument();
      expect(screen.getByText('Initial login:')).toBeInTheDocument();
      expect(screen.getByText('Role:')).toBeInTheDocument();
      expect(screen.getByText(`${Roles.USER}`)).toBeInTheDocument();
    });
  });
});

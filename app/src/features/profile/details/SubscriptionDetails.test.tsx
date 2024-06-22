import { screen } from '@testing-library/react';
import { expect, vi } from 'vitest';

import { SubscriptionType } from '@/constants';
import { INITIAL_USER_DATA } from '@/store/userSlice';
import { renderWithProviders } from '@/utils/test/testUtils';

import SubscriptionDetails from './SubscriptionDetails';

const SUBSCRIPTIONS = [
  { name: SubscriptionType.NEWS },
  { name: SubscriptionType.CODE }
];

let DATA = {
  subscribed: true,
  subscriptions: SUBSCRIPTIONS
};

describe('<SubscriptionDetails/>', () => {
  let PRELOADED_STATE = {
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
    beforeEach(() => {
      DATA = {
        subscribed: true,
        subscriptions: SUBSCRIPTIONS
      };

      PRELOADED_STATE = {
        user: {
          data: {
            ...INITIAL_USER_DATA.data,
            ...DATA
          }
        }
      };
    });

    it('should render element', () => {
      renderWithProviders(<SubscriptionDetails />, {
        preloadedState: PRELOADED_STATE
      });

      expect(
        screen.getByText('Subscription alerts activated')
      ).toBeInTheDocument();
      expect(screen.getByText(SubscriptionType.NEWS)).toBeInTheDocument();
      expect(screen.getByText(SubscriptionType.CODE)).toBeInTheDocument();
      expect(screen.getByText(SubscriptionType.GENERAL)).toBeInTheDocument();
    });

    it('should render element icon for subscribed', () => {
      renderWithProviders(<SubscriptionDetails />, {
        preloadedState: PRELOADED_STATE
      });

      expect(
        document.getElementsByClassName('tabler-icon-circle-check').length
      ).to.eq(DATA.subscriptions.length);
    });

    it('should render not activated alerts chip if user is not subscribed', () => {
      DATA = {
        subscribed: false,
        subscriptions: SUBSCRIPTIONS
      };

      PRELOADED_STATE = {
        user: {
          data: {
            ...INITIAL_USER_DATA.data,
            ...DATA
          }
        }
      };
      renderWithProviders(<SubscriptionDetails />, {
        preloadedState: PRELOADED_STATE
      });

      expect(
        screen.getByText('Subscription alerts not activated')
      ).toBeInTheDocument();
    });
  });
});

import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, vi } from 'vitest';

import {
  renderWithProviders,
  typeDataInFieldByDataTestId,
  typeDataInInputField
} from '@/utils/test/testUtils';

import LoginForm from './LoginForm';

const mockLogin = vi.fn();
const mockUseAuth = vi.fn();

let mockUseLoginMutationData = {
  isLoading: false,
  isError: false,
  data: {},
  error: {}
};

vi.mock('@/features/auth/store/authApiSlice', async () => ({
  ...(await vi.importActual<Record<string, unknown>>(
    '@/features/auth/store/authApiSlice'
  )),
  useLoginMutation: () => [mockLogin, mockUseLoginMutationData]
}));

vi.mock('@/features/auth/useAuth', async () => ({
  ...(await vi.importActual<Record<string, unknown>>(
    '@/features/auth/useAuth'
  )),
  default: () => mockUseAuth
}));

describe('<LoginForm/>', () => {
  beforeEach(() => {
    mockUseLoginMutationData = {
      isLoading: false,
      isError: false,
      data: {},
      error: {}
    };
  });

  afterEach(() => {
    mockLogin.mockReset();
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  describe('Layout test', () => {
    it('should render element', () => {
      renderWithProviders(<LoginForm />);

      expect(screen.getByText('Welcome back')).toBeInTheDocument();
      expect(screen.getByText('Email')).toBeInTheDocument();
      expect(screen.getByText('Password')).toBeInTheDocument();
      expect(screen.getByText('Login')).toBeInTheDocument();
    });

    it('should render loader if is loading state', () => {
      mockUseLoginMutationData = {
        ...mockUseLoginMutationData,
        isLoading: true
      };
      renderWithProviders(<LoginForm />);

      expect(screen.getByTestId('login-loading-overlay')).toBeInTheDocument();
    });

    it('should render error if is error state', () => {
      mockUseLoginMutationData = {
        ...mockUseLoginMutationData,
        isError: true,
        error: {
          data: 'Error occurred'
        }
      };
      renderWithProviders(<LoginForm />);

      expect(screen.getByText('Error occurred.')).toBeInTheDocument();
    });
  });

  describe('Handling submit test', () => {
    beforeEach(() => {
      mockLogin.mockReset();
    });

    it('should not submit and it will show errors if data is not entered', async () => {
      renderWithProviders(<LoginForm />);

      const button = screen.getByRole('button')!;
      await userEvent.click(button);

      expect(mockLogin).not.toHaveBeenCalled();
      expect(screen.getByText('Valid email is required.')).toBeInTheDocument();
      expect(
        screen.getByText('Password field is required.')
      ).toBeInTheDocument();
    });

    it('should not submit and it will show errors if email pattern is not correct', async () => {
      renderWithProviders(<LoginForm />);

      const button = screen.getByRole('button')!;
      await typeDataInInputField('Email', 'invalid');
      await userEvent.click(button);

      expect(mockLogin).not.toHaveBeenCalled();
      expect(screen.getByText('Valid email is required.')).toBeInTheDocument();
    });

    it('should submit for if validation pass', async () => {
      const data = {
        email: 'test@test.com',
        password: 'SomeStrongPass12!'
      };
      renderWithProviders(<LoginForm />);

      const button = screen.getByRole('button')!;
      await typeDataInInputField('Email', data.email);
      await typeDataInFieldByDataTestId('login-password', data.password);
      await userEvent.click(button);

      expect(mockLogin).toHaveBeenCalledWith(data);
    });
  });
});

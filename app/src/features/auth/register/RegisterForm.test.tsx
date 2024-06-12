import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, vi } from 'vitest';

import { VALIDATION_MESSAGES } from '@/constants';
import {
  renderWithProviders,
  typeDataInFieldByDataTestId,
  typeDataInInputField
} from '@/utils/test/testUtils';

import RegisterForm from './RegisterForm';

const mockRegister = vi.fn();
const mockUseAuth = vi.fn();

let mockUseRegisterMutationData = {
  isLoading: false,
  isError: false,
  data: {},
  error: {}
};

vi.mock('@/features/auth/store/authApiSlice', async () => ({
  ...(await vi.importActual<Record<string, unknown>>(
    '@/features/auth/store/authApiSlice'
  )),
  useRegisterMutation: () => [mockRegister, mockUseRegisterMutationData]
}));

vi.mock('@/features/auth/useAuth', async () => ({
  ...(await vi.importActual<Record<string, unknown>>(
    '@/features/auth/useAuth'
  )),
  default: () => mockUseAuth
}));

describe('<RegisterForm/>', () => {
  beforeEach(() => {
    mockUseRegisterMutationData = {
      isLoading: false,
      isError: false,
      data: {},
      error: {}
    };
  });

  afterEach(() => {
    mockRegister.mockReset();
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  describe('Layout test', () => {
    it('should render element', () => {
      renderWithProviders(<RegisterForm />);

      expect(screen.getByText('Welcome aboard')).toBeInTheDocument();
      expect(screen.getByText('Name')).toBeInTheDocument();
      expect(screen.getByText('Surname')).toBeInTheDocument();
      expect(screen.getByText('Username')).toBeInTheDocument();
      expect(screen.getByText('Email')).toBeInTheDocument();
      expect(screen.getByText('Password')).toBeInTheDocument();
      expect(screen.getByText('Register')).toBeInTheDocument();
    });

    it('should render loader if is loading state', () => {
      mockUseRegisterMutationData = {
        ...mockUseRegisterMutationData,
        isLoading: true
      };
      renderWithProviders(<RegisterForm />);

      expect(
        screen.getByTestId('register-loading-overlay')
      ).toBeInTheDocument();
    });

    it('should render error if is error state', () => {
      mockUseRegisterMutationData = {
        ...mockUseRegisterMutationData,
        isError: true,
        error: {
          data: 'Error occurred'
        }
      };
      renderWithProviders(<RegisterForm />);

      expect(screen.getByText('Error occurred.')).toBeInTheDocument();
    });
  });

  describe('Handling submit test', () => {
    beforeEach(() => {
      mockRegister.mockReset();
    });

    it('should not submit and it will show errors if data is not entered', async () => {
      renderWithProviders(<RegisterForm />);

      const button = screen.getByRole('button', { name: 'Register' })!;
      await userEvent.click(button);

      expect(mockRegister).not.toHaveBeenCalled();
      expect(
        screen.getByText(VALIDATION_MESSAGES.firstName)
      ).toBeInTheDocument();
      expect(
        screen.getByText(VALIDATION_MESSAGES.lastName)
      ).toBeInTheDocument();
      expect(screen.getByText(VALIDATION_MESSAGES.email)).toBeInTheDocument();
      expect(
        screen.getByText(VALIDATION_MESSAGES.password)
      ).toBeInTheDocument();
    });

    it('should not submit and it will show errors if email or password pattern is not correct', async () => {
      renderWithProviders(<RegisterForm />);

      const button = screen.getByRole('button', { name: 'Register' })!;
      await typeDataInInputField('Email', 'invalid');
      await typeDataInFieldByDataTestId('register-password', 'invalid');
      await userEvent.click(button);

      expect(mockRegister).not.toHaveBeenCalled();
      expect(screen.getByText(VALIDATION_MESSAGES.email)).toBeInTheDocument();
      expect(
        screen.getByText(VALIDATION_MESSAGES.password)
      ).toBeInTheDocument();
    });

    it('should submit for if validation pass', async () => {
      const data = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'test@test.com',
        password: 'SomeStrongPass12!',
        userName: ''
      };
      renderWithProviders(<RegisterForm />);

      const button = screen.getByRole('button', { name: 'Register' })!;
      await typeDataInInputField('Name', data.firstName);
      await typeDataInInputField('Surname', data.lastName);
      await typeDataInInputField('Email', data.email);
      await typeDataInFieldByDataTestId('register-password', data.password);
      await userEvent.click(button);

      expect(mockRegister).toHaveBeenCalledWith(data);
    });
  });
});

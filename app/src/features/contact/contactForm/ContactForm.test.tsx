import { notifications } from '@mantine/notifications';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, vi } from 'vitest';

import {
  renderWithProviders,
  typeDataInInputField
} from '@/utils/test/testUtils';

import ContactForm from './ContactForm';

const mockSendMessage = vi.fn();

let mockUseSendMessageMutationData = {
  isLoading: false,
  isSuccess: false,
  isError: false,
  error: {}
};

vi.mock('@/features/contact/store/contactApiSlice', async () => ({
  ...(await vi.importActual<Record<string, unknown>>(
    '@/features/contact/store/contactApiSlice'
  )),
  useSendMessageMutation: () => [
    mockSendMessage,
    mockUseSendMessageMutationData
  ]
}));

describe('<ContactForm/>', () => {
  const notificationShowSpy = vi.spyOn(notifications, 'show');

  beforeEach(() => {
    mockUseSendMessageMutationData = {
      isLoading: false,
      isSuccess: false,
      isError: false,
      error: {}
    };
  });

  afterEach(() => {
    mockSendMessage.mockReset();
    notificationShowSpy.mockReset();
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  describe('Layout test', () => {
    it('should render element', () => {
      renderWithProviders(<ContactForm />);

      expect(screen.getByText('Email')).toBeInTheDocument();
      expect(screen.getByText('Full Name')).toBeInTheDocument();
      expect(
        screen.getByRole('textbox', { name: 'Your Message' })
      ).toBeInTheDocument();
      expect(screen.getByText('Send message')).toBeInTheDocument();
    });

    it('should render loader if is loading state', () => {
      mockUseSendMessageMutationData = {
        ...mockUseSendMessageMutationData,
        isLoading: true
      };
      renderWithProviders(<ContactForm />);

      expect(screen.getByTestId('contact-loading-overlay')).toBeInTheDocument();
    });

    it('should render error if is error state', () => {
      mockUseSendMessageMutationData = {
        ...mockUseSendMessageMutationData,
        isError: true,
        error: {
          data: 'Error occurred'
        }
      };
      renderWithProviders(<ContactForm />);

      expect(screen.getByText('Error occurred.')).toBeInTheDocument();
    });
  });

  describe('Handling submit test', () => {
    beforeEach(() => {
      mockSendMessage.mockReset();
      notificationShowSpy.mockReset();
    });

    const data = {
      email: 'test@test.com',
      fullName: 'John Doe',
      message: 'Some text'
    };

    it('should not send message if no input data and it will show errors', async () => {
      renderWithProviders(<ContactForm />);

      const button = screen.getByText('Send message');
      await userEvent.click(button);

      expect(mockSendMessage).not.toHaveBeenCalled();
      expect(screen.getByText('Valid email is required.')).toBeInTheDocument();
      expect(screen.getByText('Full name is required.')).toBeInTheDocument();
      expect(screen.getByText('Message is required.')).toBeInTheDocument();
    });

    it('should not send message if email is set and have invalid pattern', async () => {
      renderWithProviders(<ContactForm />);

      const button = screen.getByText('Send message');
      await typeDataInInputField('Email', 'invalid');
      await userEvent.click(button);

      expect(mockSendMessage).not.toHaveBeenCalled();
      expect(screen.getByText('Valid email is required.')).toBeInTheDocument();
    });

    it('should send message if fullName, message and email is set', async () => {
      mockUseSendMessageMutationData = {
        ...mockUseSendMessageMutationData,
        isSuccess: true
      };

      renderWithProviders(<ContactForm />);

      const message = screen.getByRole('textbox', { name: 'Your Message' });
      const button = screen.getByText('Send message');

      await typeDataInInputField('Email', data.email);
      await typeDataInInputField('Full Name', data.fullName);
      await userEvent.type(message, data.message);

      await userEvent.click(button);

      expect(mockSendMessage).toHaveBeenCalledWith(data);
      expect(notificationShowSpy).toHaveBeenCalledTimes(1);
    });

    it('should not call on submit callback if request fails', async () => {
      mockUseSendMessageMutationData = {
        ...mockUseSendMessageMutationData,
        isSuccess: false,
        isError: true,
        error: {
          data: 'Error occurred'
        }
      };

      renderWithProviders(<ContactForm />);

      const message = screen.getByRole('textbox', { name: 'Your Message' });
      const button = screen.getByText('Send message');

      await typeDataInInputField('Email', data.email);
      await typeDataInInputField('Full Name', data.fullName);
      await userEvent.type(message, data.message);

      await userEvent.click(button);

      expect(mockSendMessage).toHaveBeenCalledWith(data);
      expect(notificationShowSpy).toHaveBeenCalledTimes(0);
      expect(screen.getByText('Error occurred.')).toBeInTheDocument();
    });
  });
});

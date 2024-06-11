import { notifications } from '@mantine/notifications';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, vi } from 'vitest';

import { renderWithProviders } from '@/utils/test/testUtils';

import Actions from './Actions';

const mockDeleteMessage = vi.fn();

let mockUseDeleteMessageMutationData = {
  isLoading: false,
  isSuccess: false,
  isError: false,
  error: {}
};

vi.mock('@/features/contact/store/contactApiSlice', async () => ({
  ...(await vi.importActual<Record<string, unknown>>(
    '@/features/contact/store/contactApiSlice'
  )),
  useDeleteMessageMutation: () => [
    mockDeleteMessage,
    mockUseDeleteMessageMutationData
  ]
}));

describe('<Actions/>', () => {
  const notificationShowSpy = vi.spyOn(notifications, 'show');
  const MESSAGE_ID = 'message-id';

  beforeEach(() => {
    mockUseDeleteMessageMutationData = {
      isLoading: false,
      isSuccess: false,
      isError: false,
      error: {}
    };
  });

  afterEach(() => {
    mockDeleteMessage.mockReset();
    notificationShowSpy.mockReset();
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  describe('Layout test', () => {
    it('should render element', () => {
      renderWithProviders(<Actions id={MESSAGE_ID} unread={false} />);

      expect(screen.getByTestId('message-delete-icon')).toBeInTheDocument();
      expect(screen.getByTestId('message-show-icon')).toBeInTheDocument();
    });
  });

  describe('Handling deleting logic test', () => {
    beforeEach(() => {
      mockDeleteMessage.mockReset();
      notificationShowSpy.mockReset();
    });

    it('should delete message and not show error notification', async () => {
      mockUseDeleteMessageMutationData = {
        ...mockUseDeleteMessageMutationData,
        isSuccess: true
      };
      renderWithProviders(<Actions id={MESSAGE_ID} unread={false} />);

      await userEvent.click(screen.getByTestId('message-delete-icon'));

      expect(mockDeleteMessage).toHaveBeenCalledWith(MESSAGE_ID);
      expect(notificationShowSpy).toHaveBeenCalledTimes(0);
    });

    it('should not delete message and show error notification if request fails', async () => {
      mockUseDeleteMessageMutationData = {
        ...mockUseDeleteMessageMutationData,
        isSuccess: false,
        isError: true,
        error: {
          data: 'Error occurred'
        }
      };
      renderWithProviders(<Actions id={MESSAGE_ID} unread={false} />);

      await userEvent.click(screen.getByTestId('message-delete-icon'));

      expect(mockDeleteMessage).toHaveBeenCalledWith(MESSAGE_ID);
      expect(notificationShowSpy).toHaveBeenCalledTimes(1);
    });
  });
});

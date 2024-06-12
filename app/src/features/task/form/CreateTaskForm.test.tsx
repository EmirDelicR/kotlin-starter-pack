import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, vi } from 'vitest';

import { VALIDATION_MESSAGES } from '@/constants';
import {
  renderWithProviders,
  typeDataInInputField
} from '@/utils/test/testUtils';

import CreateTaskForm from './CreateTaskForm';

const mockAddTask = vi.fn();
const mockOnSuccessCallback = vi.fn();
let mockHookData = {
  isLoading: false,
  isSuccess: false,
  isError: false,
  error: {}
};

const TASK_TITLE = 'my-task';

vi.mock('@/features/task/store/taskApiSlice', async () => ({
  ...(await vi.importActual<Record<string, unknown>>(
    '@/features/task/store/taskApiSlice'
  )),
  useAddTaskMutation: () => [mockAddTask, mockHookData]
}));

describe('<CreateTaskForm/>', () => {
  beforeEach(() => {
    mockHookData = {
      isLoading: false,
      isSuccess: false,
      isError: false,
      error: {}
    };
  });

  afterEach(() => {
    mockAddTask.mockReset();
    mockOnSuccessCallback.mockReset();
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  describe('Create task test', () => {
    it('should not create task and it will render error if input is not added', async () => {
      renderWithProviders(
        <CreateTaskForm onSuccessCallback={mockOnSuccessCallback} />
      );

      await userEvent.click(screen.getByText('Submit'));

      expect(screen.getByText(VALIDATION_MESSAGES.title)).toBeInTheDocument();
    });

    it('should not create task and it will render error if request fails', () => {
      mockHookData = {
        ...mockHookData,
        isError: true,
        error: {
          data: 'Request fail'
        }
      };
      renderWithProviders(
        <CreateTaskForm onSuccessCallback={mockOnSuccessCallback} />
      );

      expect(screen.getByText('Request fail.')).toBeInTheDocument();
    });

    it('should show loading overlay if request is loading', () => {
      mockHookData = {
        ...mockHookData,
        isLoading: true
      };
      renderWithProviders(
        <CreateTaskForm onSuccessCallback={mockOnSuccessCallback} />
      );

      expect(screen.getByTestId('create-task-loader')).toBeInTheDocument();
    });

    it('should create task and reset form', async () => {
      mockHookData = {
        ...mockHookData,
        isSuccess: true
      };
      renderWithProviders(
        <CreateTaskForm onSuccessCallback={mockOnSuccessCallback} />
      );

      await typeDataInInputField('Enter new task', TASK_TITLE);
      await userEvent.click(screen.getByText('Submit'));

      expect(mockAddTask).toBeCalledTimes(1);
      expect(mockOnSuccessCallback).toBeCalledTimes(1);
    });
  });
});

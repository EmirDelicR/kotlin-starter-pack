import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, vi } from 'vitest';

import { INITIAL_USER_DATA } from '@/store/userSlice';
import { renderWithProviders } from '@/utils/test/testUtils';

import TaskManager from './TaskManager';

const mockUpdateTask = vi.fn();
const mockDeleteTask = vi.fn();

const mockHookData = {
  isLoading: false,
  isSuccess: false,
  isError: false,
  error: {}
};

const USER_ID = 'user-id';
const TASK_TITLE = 'my-task';
const DEFAULT_TASK = {
  userId: USER_ID,
  id: '1',
  title: TASK_TITLE,
  completed: false
};
const DATA = {
  items: [DEFAULT_TASK],
  numberOfPages: 2
};
let mockGetPaginatedTasksData = {
  data: DATA,
  isLoading: false,
  isSuccess: true,
  isError: false,
  error: {}
};

vi.mock('@/features/task/store/taskApiSlice', async () => ({
  ...(await vi.importActual<Record<string, unknown>>(
    '@/features/task/store/taskApiSlice'
  )),
  useUpdateTaskMutation: () => [mockUpdateTask, mockHookData],
  useDeleteTaskMutation: () => [mockDeleteTask, mockHookData],
  useGetPaginatedTasksQuery: () => mockGetPaginatedTasksData
}));

describe('<TaskManager/>', () => {
  const PRELOADED_STATE = {
    user: {
      data: {
        ...INITIAL_USER_DATA.data,
        id: USER_ID
      }
    }
  };

  beforeEach(() => {
    mockGetPaginatedTasksData = {
      data: DATA,
      isLoading: false,
      isSuccess: true,
      isError: false,
      error: {}
    };
  });

  afterEach(() => {
    mockUpdateTask.mockReset();
    mockDeleteTask.mockReset();
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  describe('Layout test', () => {
    it('should render element', () => {
      renderWithProviders(<TaskManager />, { preloadedState: PRELOADED_STATE });

      expect(screen.getByText('Manage tasks')).toBeInTheDocument();
      expect(screen.getByText(TASK_TITLE)).toBeInTheDocument();
      expect(screen.getByTestId('task-update-icon')).toBeInTheDocument();
      expect(screen.getByTestId('task-delete-icon')).toBeInTheDocument();
    });

    it('should not render items and pagination if no elements', () => {
      mockGetPaginatedTasksData = {
        data: { items: [], numberOfPages: 0 },
        isLoading: false,
        isSuccess: true,
        isError: false,
        error: {}
      };

      renderWithProviders(<TaskManager />, { preloadedState: PRELOADED_STATE });

      expect(screen.queryByText(TASK_TITLE)).not.toBeInTheDocument();
      expect(screen.queryByTestId('task-update-icon')).not.toBeInTheDocument();
      expect(screen.queryByTestId('task-delete-icon')).not.toBeInTheDocument();
    });
  });

  describe('Update/delete task test', () => {
    it('should call update task', async () => {
      renderWithProviders(<TaskManager />, { preloadedState: PRELOADED_STATE });

      await userEvent.click(screen.getByTestId('task-update-icon'));

      expect(mockUpdateTask).toHaveBeenCalledWith({
        completed: true,
        id: DEFAULT_TASK.id,
        title: DEFAULT_TASK.title,
        userId: USER_ID
      });
    });

    it('should call delete', async () => {
      renderWithProviders(<TaskManager />, { preloadedState: PRELOADED_STATE });

      await userEvent.click(screen.getByTestId('task-delete-icon'));

      expect(mockDeleteTask).toHaveBeenCalledWith({
        userId: USER_ID,
        taskId: DEFAULT_TASK.id
      });
    });
  });

  describe('Task list test', () => {
    it('should not render content if isSuccess is false', () => {
      mockGetPaginatedTasksData = {
        ...mockGetPaginatedTasksData,
        isSuccess: false
      };
      renderWithProviders(<TaskManager />, { preloadedState: PRELOADED_STATE });

      expect(screen.queryByText(TASK_TITLE)).not.toBeInTheDocument();
      expect(
        screen.queryByText('Currently there is no data.')
      ).not.toBeInTheDocument();
    });

    it('should not render message if there is not items', () => {
      mockGetPaginatedTasksData = {
        ...mockGetPaginatedTasksData,
        data: {
          items: [],
          numberOfPages: 0
        }
      };
      renderWithProviders(<TaskManager />, { preloadedState: PRELOADED_STATE });

      expect(
        screen.getByText('Currently there is no data.')
      ).toBeInTheDocument();
    });

    it('should render loader if state is loading', () => {
      mockGetPaginatedTasksData = {
        ...mockGetPaginatedTasksData,
        isLoading: true
      };
      renderWithProviders(<TaskManager />, { preloadedState: PRELOADED_STATE });

      expect(screen.getByTestId('task-list-loader')).toBeInTheDocument();
    });

    it('should render error message if state is error', () => {
      mockGetPaginatedTasksData = {
        ...mockGetPaginatedTasksData,
        isError: true,
        error: {
          data: 'Error occurred'
        }
      };
      renderWithProviders(<TaskManager />, { preloadedState: PRELOADED_STATE });

      expect(screen.getByText('Error occurred.')).toBeInTheDocument();
    });
  });
});

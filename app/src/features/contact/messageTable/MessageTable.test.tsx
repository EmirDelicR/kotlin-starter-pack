import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, vi } from 'vitest';

import { renderWithProviders } from '@/utils/test/testUtils';

import { Message } from '../store/contactApiSlice';
import MessageTable from './MessageTable';

const mockUpdateMessage = vi.fn();

const MESSAGE_DATA = {
  numberOfPages: 2,
  items: [
    {
      id: 'dummy-message-id-1',
      sender: 'John Doe',
      message: 'Search success.',
      email: 'john@doe.com',
      unread: true,
      createdAt: '2024-02-17T10:19:32.712Z'
    },
    {
      id: 'dummy-message-id-2',
      sender: 'Cleave Jacobi',
      message: 'Some dummy text that user send.',
      email: 'Cleave@Jacobi.com',
      unread: true,
      createdAt: '2024-02-17T09:19:32.712Z'
    },
    {
      id: 'dummy-message-id-3',
      sender: 'Juliet Doe',
      message: 'Different dummy text that user send.',
      email: 'Juliet@doe.com',
      unread: false,
      createdAt: '2024-02-18T11:19:32.712Z'
    },
    {
      id: 'dummy-message-id-4',
      sender: 'Nikki Rice',
      message: 'Some dummy text that user send.',
      email: 'Nikki@Rice.com',
      unread: true,
      createdAt: '2024-02-19T11:19:32.712Z'
    },
    {
      id: 'dummy-message-id-5',
      sender: 'Zay Davis',
      message: 'Some dummy text that user send.',
      email: 'zay@Davis.com',
      unread: true,
      createdAt: '2024-02-21T11:19:32.712Z'
    }
  ]
};

let mockUseGetPaginatedMessagesQueryData = {
  isLoading: false,
  isSuccess: false,
  isError: false,
  error: {},
  data: MESSAGE_DATA
};

// Mock the ResizeObserver
const ResizeObserverMock = vi.fn(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn()
}));

// Stub the global ResizeObserver
vi.stubGlobal('ResizeObserver', ResizeObserverMock);

vi.mock('@/features/contact/store/contactApiSlice', async () => ({
  ...(await vi.importActual<Record<string, unknown>>(
    '@/features/contact/store/contactApiSlice'
  )),
  useGetPaginatedMessagesQuery: () => mockUseGetPaginatedMessagesQueryData
}));

describe('<MessageTable/>', () => {
  beforeEach(() => {
    mockUseGetPaginatedMessagesQueryData = {
      isLoading: false,
      isSuccess: false,
      isError: false,
      error: {},
      data: MESSAGE_DATA
    };
  });

  afterEach(() => {
    mockUpdateMessage.mockReset();
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  describe('Layout test', () => {
    beforeEach(() => {
      mockUseGetPaginatedMessagesQueryData = {
        isLoading: false,
        isSuccess: false,
        isError: false,
        error: {},
        data: MESSAGE_DATA
      };
    });

    it('should render element', () => {
      renderWithProviders(<MessageTable />);

      expect(screen.getByTestId('search-input')).toBeInTheDocument();
      expect(screen.getByTestId('show-entry-select')).toBeInTheDocument();
      expect(screen.getByText('ID')).toBeInTheDocument();
      expect(screen.getByText('Email')).toBeInTheDocument();
      expect(screen.getByText('Message')).toBeInTheDocument();
      expect(screen.getByText('Sender')).toBeInTheDocument();
      expect(screen.getByText('Created At')).toBeInTheDocument();
      expect(screen.getByText('Actions')).toBeInTheDocument();
    });

    it('should render loader if query request is in loading state', () => {
      mockUseGetPaginatedMessagesQueryData = {
        ...mockUseGetPaginatedMessagesQueryData,
        isLoading: true
      };
      renderWithProviders(<MessageTable />);

      expect(screen.getByTestId('custom-table-loader')).toBeInTheDocument();
    });

    it('should render error message if request fails', () => {
      mockUseGetPaginatedMessagesQueryData = {
        ...mockUseGetPaginatedMessagesQueryData,
        isError: true,
        error: {
          data: 'Error occurred'
        }
      };
      renderWithProviders(<MessageTable />);

      expect(screen.getByText('Error occurred.')).toBeInTheDocument();
    });

    it('should render info alert if there is no data for message', () => {
      mockUseGetPaginatedMessagesQueryData = {
        ...mockUseGetPaginatedMessagesQueryData,
        data: undefined as unknown as {
          numberOfPages: number;
          items: Message[];
        }
      };
      renderWithProviders(<MessageTable />);

      expect(screen.getByText('There is no data.')).toBeInTheDocument();
    });

    it('should render 30 cell + 1 with pagination', () => {
      renderWithProviders(<MessageTable />);

      const cells = screen.getAllByRole('cell');

      expect(cells.length).to.eq(MESSAGE_DATA.items.length * 6 + 1);
    });
  });

  describe('Handling sort logic', () => {
    it('should sort by email desc', async () => {
      renderWithProviders(<MessageTable />);

      await userEvent.click(screen.getByText('Email'));
      const cells = screen.getAllByRole('cell');

      expect(cells[0].getElementsByTagName('p')[0].innerHTML).to.eq(
        'dummy-message-id-2'
      );
    });

    it('should sort by email asc', async () => {
      renderWithProviders(<MessageTable />);

      await userEvent.dblClick(screen.getByText('Email'));
      const cells = screen.getAllByRole('cell');

      expect(cells[0].getElementsByTagName('p')[0].innerHTML).to.eq(
        'dummy-message-id-5'
      );
    });

    it('should go to default state after triple click', async () => {
      renderWithProviders(<MessageTable />);

      await userEvent.tripleClick(screen.getByText('Email'));
      const cells = screen.getAllByRole('cell');

      expect(cells[0].getElementsByTagName('p')[0].innerHTML).to.eq(
        'dummy-message-id-1'
      );
    });
  });
});

import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect } from 'vitest';

import { renderWithProviders } from '@/utils/test/testUtils';

import DebounceInput from './DebounceInput';

const mockOnChange = vi.fn();

describe('<DebounceInput/>', () => {
  beforeEach(() => {
    mockOnChange.mockReset();
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  describe('Input logic test', () => {
    it('should call on change after 500ms', async () => {
      renderWithProviders(
        <DebounceInput initialValue={''} onChange={mockOnChange} />
      );

      await userEvent.type(screen.queryByRole('textbox')!, 'data');

      expect(screen.queryByRole('textbox')).toBeInTheDocument();
      expect(screen.getByTestId('debounce-input-loader')).toBeInTheDocument();

      await waitFor(
        () => {
          expect(mockOnChange).toBeCalledWith('data');
          expect(
            screen.queryByTestId('debounce-input-loader')
          ).not.toBeInTheDocument();
        },
        { timeout: 501 }
      );
    });
  });
});

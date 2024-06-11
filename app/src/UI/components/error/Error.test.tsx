import { screen } from '@testing-library/react';
import { expect } from 'vitest';

import { renderWithProviders } from '@/utils/test/testUtils';

import Error from './Error';

const ERROR = {
  error: 'Test error occurred'
};

describe('<Error/>', () => {
  afterAll(() => {
    vi.restoreAllMocks();
  });

  describe('Layout test', () => {
    it('should not render element if no error', () => {
      renderWithProviders(<Error isError={false} error={undefined} />);

      expect(
        screen.queryByText('Undefined Error occurred!')
      ).not.toBeInTheDocument();
    });

    it('should render element if error with default message', () => {
      renderWithProviders(<Error isError={true} error={undefined} />);

      expect(screen.getByText('Undefined Error occurred!')).toBeInTheDocument();
    });

    it('should render element if error with correct message', () => {
      renderWithProviders(<Error isError={true} error={ERROR} />);

      expect(screen.getByText(`${ERROR.error} |`)).toBeInTheDocument();
    });
  });
});

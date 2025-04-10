import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, test, expect } from 'vitest';
import SearchInput from './SearchInput';
import { useSearchStore } from '@/store/searchStore';
import { waitFor } from '@testing-library/react';

vi.mock('@/store/searchStore', () => {
  return {
    useSearchStore: vi.fn().mockImplementation((selector) =>
      selector({
        query: '',
        setQuery: vi.fn(),
      })
    ),
  };
});

describe('SearchInput', () => {
  test('debounces and sets query after input', async () => {
    const setQueryMock = vi.fn();
    (useSearchStore as unknown as vi.Mock).mockImplementation((selector) =>
      selector({
        query: '',
        setQuery: setQueryMock,
      })
    );

    render(<SearchInput />);
    const input = screen.getByPlaceholderText('Search...');
    await userEvent.type(input, 'Lipstick');

    await waitFor(() => {
      expect(setQueryMock).toHaveBeenCalledWith('Lipstick');
    }, { timeout: 6000 });
  });
});

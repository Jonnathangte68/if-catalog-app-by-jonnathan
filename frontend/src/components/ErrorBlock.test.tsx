import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, test, vi, expect } from 'vitest';
import ErrorBlock from './ErrorBlock';

describe('ErrorBlock', () => {
  test('renders error message and calls onRetry when button is clicked', async () => {
    const onRetryMock = vi.fn();

    render(<ErrorBlock onRetry={onRetryMock} />);

    expect(
      screen.getByText(/Something went wrong/i)
    ).toBeInTheDocument();

    await userEvent.click(
      screen.getByRole('button', { name: /retry/i })
    );

    expect(onRetryMock).toHaveBeenCalledTimes(1);
  });
});

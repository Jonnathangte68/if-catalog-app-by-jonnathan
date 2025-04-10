import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ProductsPage from './ProductsPage';
import { fetchProducts } from '@/services/products';
import { MemoryRouter } from 'react-router-dom';

vi.mock('@/services/products', async () => {
  return {
    fetchProducts: vi.fn(),
  };
});

const mockedFetchProducts = fetchProducts as unknown as vi.Mock;

function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });
}

beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }),
  });
});

describe('ProductsPage', () => {
  test('shows loading state', () => {
    mockedFetchProducts.mockImplementation(() => new Promise(() => {}));

    const client = createTestQueryClient();
    render(
      <QueryClientProvider client={client}>
        <MemoryRouter>
          <ProductsPage />
        </MemoryRouter>
      </QueryClientProvider>
    );

    expect(screen.getByLabelText(/loading products/i)).toBeInTheDocument();
  });

  test('shows error state and retry button', async () => {
    mockedFetchProducts.mockRejectedValueOnce(new Error('Fetch failed'));

    const client = createTestQueryClient();
    render(
      <QueryClientProvider client={client}>
        <MemoryRouter>
          <ProductsPage />
        </MemoryRouter>
      </QueryClientProvider>
    );

    expect(
      await screen.findByText(/something went wrong/i)
    ).toBeInTheDocument();

    const retryBtn = screen.getByRole('button', { name: /retry/i });
    expect(retryBtn).toBeInTheDocument();
  });

  test('shows product list when fetch succeeds', async () => {
    mockedFetchProducts.mockResolvedValue([
      {
        id: '1',
        title: 'Test Product',
        description: 'A great product',
        price: 99.99,
        image: 'https://dummyimage.com/300x300',
      },
    ]);

    const client = createTestQueryClient();
    render(
      <QueryClientProvider client={client}>
        <MemoryRouter>
          <ProductsPage />
        </MemoryRouter>
      </QueryClientProvider>
    );

    expect(await screen.findByText(/test product/i)).toBeInTheDocument();
    expect(screen.getByText(/€99.99/i)).toBeInTheDocument();
  });
});

import { useQuery } from '@tanstack/react-query';
import { fetchProducts } from '@/services/products';
import ProductList from '@/features/products/ProductList';
import ErrorBlock from '@/components/ErrorBlock';
import SkeletonProductCard from '@/components/SkeletonProductCard';

export default function ProductsPage() {
  const {
    data: products,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
    retry: import.meta.env.MODE === 'test' ? 0 : 3,
  });

  if (isLoading) {
    return (
      <div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        aria-busy="true"
        aria-label="Loading products"
      >
        {Array.from({ length: 8 }).map((_, index) => (
          <SkeletonProductCard key={index} />
        ))}
      </div>
    );
  }

  if (isError) {
    return <ErrorBlock onRetry={refetch} />;
  }

  return (
    <div data-testid="products-page" className="animate-fade-in">
      <ProductList data={products ?? []} />
    </div>
  );
}

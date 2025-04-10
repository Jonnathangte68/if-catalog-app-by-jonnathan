import { useSearchStore } from '@/store/searchStore';
import { useMemo } from 'react';
import ProductCard from '@/features/products/ProductCard';
import { Product } from '@/types/Product';

interface ProductListProps {
  data: Product[];
}

export default function ProductList({ data }: ProductListProps) {
  const query = useSearchStore((state) => state.query);
  const setQuery = useSearchStore((state) => state.setQuery);


  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q
      ? data.filter(
          (p) =>
            p.title.toLowerCase().includes(q) ||
            p.description?.toLowerCase().includes(q)
        )
      : data;
  }, [data, query]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {filtered.length > 0 ? filtered.map((product) => (
        <ProductCard key={product.id} product={product} />
      )) : (
        <div
          className="transition-opacity duration-300 ease-in-out opacity-100"
          aria-live="polite"
        >
          <section className="text-center text-gray-600 dark:text-gray-300 col-span-full mt-10">
            <p className="text-lg">No products match your search.</p>
            <button
              onClick={() => setQuery('')}
              className="mt-4 underline text-sm text-if-blue dark:text-white"
            >
              Reset search
            </button>
          </section>
        </div>
      )}
    </div>
  );
}

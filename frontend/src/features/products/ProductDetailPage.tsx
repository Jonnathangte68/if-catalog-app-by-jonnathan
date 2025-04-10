import { useParams, Link } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { Product } from '@/types/Product';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const products = queryClient.getQueryData<Product[]>(['products']);
  const product = products?.find((p) => p.id === id);

  if (!product) {
    return (
      <div className="text-center mt-12 text-gray-600 dark:text-gray-300">
        Product not found.
        <div className="mt-4">
          <Link to="/" className="text-if-blue underline">← Back to products</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto mt-10 px-4 sm:px-6 lg:px-8 py-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        
        <div
            className="aspect-[4/3] w-full overflow-hidden rounded-md"
            role="img"
            aria-label={`Image of ${product.title}`}
        >
            <img
                loading="lazy"
                src={product.image ?? '/fallback.jpg'}
                alt={product.title}
                className="w-full h-full object-cover bg-gray-100 dark:bg-gray-700"
            />
        </div>

        <div className="flex flex-col justify-center">
          <h2
            data-testid="product-title"
            className="text-3xl font-bold text-gray-800 dark:text-white mb-4"
          >
            {product.title}
          </h2>
          <p className="text-gray-700 dark:text-gray-300 text-lg mb-4">
            {product.description}
          </p>
          <div className="text-2xl font-semibold mb-6 text-if-blue dark:text-white">
            €{product.price.toFixed(2)}
          </div>
          <Link to="/" className="text-if-blue underline text-sm">← Back to products</Link>
          <button
            disabled
            className="mt-4 px-4 py-2 bg-if-blue dark:bg-gray-700 text-white font-medium rounded-md opacity-60 cursor-not-allowed"
          >
            Add to Cart (Coming Soon)
          </button>
        </div>
      </div>
    </div>
  );
}

import { Product } from '@/types/Product';
import { Link } from 'react-router-dom';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link
      to={`/products/${product.id}`}
      data-testid="product-card"
      className="bg-white dark:bg-gray-900 border dark:border-gray-700 rounded-2xl shadow p-4 hover:shadow-md transition flex flex-col"
      >
      {product.image && (
        <div className="aspect-[4/3] w-full mb-4 overflow-hidden rounded-md">
          <img
            loading="lazy"
            src={product.image}
            alt={product.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{product.title}</h3>
      <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">{product.description}</p>
      <p className="font-bold mt-2 text-if-blue dark:text-white">
        €{product.price.toFixed(2)}
      </p>
    </Link>
  );
}

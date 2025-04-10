import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="text-center mt-20 px-4 text-gray-700 dark:text-gray-300">
      <h1 className="text-4xl font-extrabold mb-4 text-gray-900 dark:text-white">
        404 - Page Not Found
      </h1>
      <p className="mb-6 text-base md:text-lg">
        Sorry, we couldn't find what you were looking for.
      </p>
      <Link
        to="/"
        className="text-if-blue dark:text-white underline hover:text-if-blue/80 dark:hover:text-white/80 transition"
      >
        ← Back to products
      </Link>
    </div>
  );
}

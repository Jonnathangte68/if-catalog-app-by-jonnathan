import { RefreshCcw } from 'lucide-react';

interface ErrorBlockProps {
  onRetry: () => void;
}

export default function ErrorBlock({ onRetry }: ErrorBlockProps) {
  return (
    <div className="p-4 flex flex-col items-center justify-center gap-3" data-testid="error-message">
      <span className="text-red-600 dark:text-red-400 text-lg font-medium">
        Something went wrong. Please try again later.
      </span>
      <button
        aria-label="Retry loading products"
        onClick={onRetry}
        data-testid="retry-button"
        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded hover:bg-blue-700 dark:hover:bg-blue-600 transition"
      >
        <RefreshCcw size={16} />
        Retry
      </button>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { useSearchStore } from '@/store/searchStore';

export default function SearchInput() {
  const query = useSearchStore((state) => state.query);
  const setQuery = useSearchStore((state) => state.setQuery);

  const [localQuery, setLocalQuery] = useState(query);

  const debounced = useDebouncedCallback((value: string) => {
    setQuery(value);
  }, 300);

  useEffect(() => {
    debounced(localQuery);
  }, [localQuery, debounced]);

  useEffect(() => {
    if (query === '' && localQuery !== '') {
      setLocalQuery('');
    }
  }, [query]);

  return (
    <>
      <label htmlFor="search" className="sr-only">
        Search products
      </label>
      <input
        type="text"
        placeholder="Search..."
        value={localQuery}
        onChange={(e) => setLocalQuery(e.target.value)}
        className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 px-3 py-1 rounded-md w-full sm:w-64 transition"
      />
    </>
  );
}

import SearchInput from '@/components/SearchInput';
import DarkModeToggle from '@/components/DarkModeToggle';
import { ReactNode } from 'react';

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <header className="bg-white dark:bg-gray-800 shadow p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-xl font-bold text-gray-800 dark:text-white" aria-label="Product Catalog">
          Product Catalog
        </h1>
        <div className="flex items-center gap-4">
          <SearchInput />
          <DarkModeToggle />
        </div>
      </header>
      <main className="flex-1 p-4">{children}</main>
    </div>
  );
}

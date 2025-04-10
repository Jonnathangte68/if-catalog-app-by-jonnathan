import useDarkMode from '@/hooks/useDarkMode';
import { Moon, Sun } from 'lucide-react';

export default function DarkModeToggle() {
  const [isDark, setIsDark] = useDarkMode();

  return (
    <button
      aria-label="Toggle Dark Mode"
      onClick={() => setIsDark(!isDark)}
      className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
    >
      {isDark ? <Sun className="text-yellow-400" /> : <Moon className="text-gray-600" />}
    </button>
  );
}

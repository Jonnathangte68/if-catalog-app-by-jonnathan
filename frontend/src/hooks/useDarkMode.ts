import { useState, useEffect } from 'react';

export default function useDarkMode() {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    if (saved !== null) {
      return JSON.parse(saved);
    }
    // Auto-detect system preference, used to detect the preference of the user If dark mode or the other light tone
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    const className = 'dark';
    const element = window.document.documentElement;

    if (isDark) {
      element.classList.add(className);
    } else {
      element.classList.remove(className);
    }

    localStorage.setItem('darkMode', JSON.stringify(isDark));
  }, [isDark]);

  return [isDark, setIsDark] as const;
}

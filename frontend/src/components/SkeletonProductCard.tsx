import ContentLoader from 'react-content-loader';
import { useEffect, useState } from 'react';

export default function SkeletonProductCard() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const darkMode = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDark(darkMode.matches);
    darkMode.addEventListener('change', (e) => setIsDark(e.matches));
    return () => darkMode.removeEventListener('change', () => {});
  }, []);

  return (
    <ContentLoader
      speed={2}
      width="100%"
      height={300}
      backgroundColor={isDark ? '#2d3748' : '#f3f3f3'}
      foregroundColor={isDark ? '#4a5568' : '#ecebeb'}
      className="rounded-2xl shadow overflow-hidden"
    >
      <rect x="0" y="0" rx="8" ry="8" width="100%" height="180" />
      <rect x="16" y="200" rx="4" ry="4" width="80%" height="20" />
      <rect x="16" y="230" rx="3" ry="3" width="90%" height="16" />
      <rect x="16" y="260" rx="4" ry="4" width="40%" height="20" />
    </ContentLoader>
  );
}

// src/hooks/useTheme.js
import { useEffect } from 'react';

export function useTheme() {
  const theme = 'dark';
  const toggle = () => {};

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'dark');
    localStorage.setItem('sports-theme', 'dark');
  }, []);

  return { theme, toggle };
}

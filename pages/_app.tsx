import type { AppProps } from 'next/app';
import { useState, useEffect } from 'react';
import '../styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    // Check for saved theme preference, default to light mode for new users
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setTheme(savedTheme);
      document.body.className = savedTheme === 'dark' ? 'dark-mode' : 'light-mode';
    } else {
      // Default to light mode for new users
      setTheme('light');
      localStorage.setItem('theme', 'light');
      document.body.className = 'light-mode';
    }
  }, []);

  return (
    <div className={theme}>
      <Component {...pageProps} />
    </div>
  );
}
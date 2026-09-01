import {
  useEffect,
  useState,
  type ReactNode,
} from 'react';

import {
  ThemeContext,
  type Theme,
} from './theme-context';

function getInitialTheme(): Theme {
  const storedTheme =
    localStorage.getItem('theme');

  if (
    storedTheme === 'dark' ||
    storedTheme === 'light'
  ) {
    return storedTheme;
  }

  return window.matchMedia(
    '(prefers-color-scheme: light)',
  ).matches
    ? 'light'
    : 'dark';
}

export function ThemeProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [theme, setTheme] =
    useState<Theme>(getInitialTheme);

  useEffect(() => {
    document.documentElement.dataset.theme =
      theme;

    localStorage.setItem(
      'theme',
      theme,
    );
  }, [theme]);

  const toggleTheme = () => {
    setTheme((currentTheme) =>
      currentTheme === 'dark'
        ? 'light'
        : 'dark',
    );
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}
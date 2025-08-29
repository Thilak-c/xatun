'use client';

import { createContext, useContext, useEffect, useState } from 'react';

const ThemeProviderContext = createContext({
  theme: 'dark',
  setTheme: () => null,
});

export function ThemeProvider({
  children,
  defaultTheme = 'dark',
  storageKey = 'xatun-theme',
  ...props
}) {
  const [theme, setTheme] = useState(defaultTheme);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    const savedTheme = localStorage.getItem(storageKey);
    if (savedTheme) {
      setTheme(savedTheme);
    } else if (defaultTheme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      setTheme(systemTheme);
    }
  }, [defaultTheme, storageKey]);

  useEffect(() => {
    if (!mounted) return;

    const root = window.document.documentElement;
    
    // Remove existing theme classes
    root.classList.remove('light', 'dark');
    
    // Add new theme class
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
      console.log('System theme applied:', systemTheme);
    } else {
      root.classList.add(theme);
      console.log('Theme applied:', theme);
    }
    
    // Force a re-render by updating data attribute
    root.setAttribute('data-theme', theme);
    
    // Update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', theme === 'dark' ? '#0f172a' : '#ffffff');
    }
  }, [theme, mounted]);

  const value = {
    theme,
    setTheme: (newTheme) => {
      localStorage.setItem(storageKey, newTheme);
      setTheme(newTheme);
    },
  };

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <ThemeProviderContext.Provider {...props} value={value}>
        <div className="dark" style={{ visibility: 'hidden' }}>
          {children}
        </div>
      </ThemeProviderContext.Provider>
    );
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
}; 
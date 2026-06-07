import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('theme-preference');
    return (saved as Theme) || 'system';
  });

  const [isDark, setIsDark] = useState<boolean>(false);

  useEffect(() => {
    const root = window.document.documentElement;
    
    const applyTheme = (currentTheme: Theme) => {
      root.classList.remove('light', 'dark');
      
      let resolvedIsDark = false;
      if (currentTheme === 'system') {
        resolvedIsDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      } else {
        resolvedIsDark = currentTheme === 'dark';
      }
      
      if (resolvedIsDark) {
        root.classList.add('dark');
      } else {
        root.classList.add('light');
      }
      
      setIsDark(resolvedIsDark);
    };

    applyTheme(theme);
    localStorage.setItem('theme-preference', theme);
  }, [theme]);

  // Listen for system theme changes if set to 'system'
  useEffect(() => {
    if (theme !== 'system') return;
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      const root = window.document.documentElement;
      root.classList.remove('light', 'dark');
      if (e.matches) {
        root.classList.add('dark');
        setIsDark(true);
      } else {
        root.classList.add('light');
        setIsDark(false);
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, isDark, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};


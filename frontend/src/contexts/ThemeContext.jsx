import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    // Default to true (dark mode) if no preference is saved
    return saved !== null ? JSON.parse(saved) : true;
  });

  useEffect(() => {
    console.log('Theme changed to:', darkMode ? 'dark' : 'light');
    // Save preference to local storage
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    
    // Update document class
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [darkMode]);

  const value = {
    darkMode,
    setDarkMode: (value) => {
      console.log('setDarkMode called with:', value);
      setDarkMode(value);
    }
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
} 
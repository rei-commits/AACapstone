import React, { createContext, useState, useEffect, useContext } from 'react';

// Create a context for theme management
export const ThemeContext = createContext();

/**
 * Custom hook to use theme context
 * Provides easy access to theme state and toggle function
 * @returns {Object} { darkMode, toggleTheme }
 */
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

/**
 * Theme Provider Component
 * Manages dark/light mode state and provides it to children
 * Persists theme choice in localStorage
 * Syncs with system preferences by default
 */
export const ThemeProvider = ({ children }) => {
  // Initialize theme state from localStorage or system preference
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem('theme') === 'dark' || 
    (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)
  );

  // Update document class and localStorage when theme changes
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  // Function to toggle between dark and light mode
  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  return (
    <ThemeContext.Provider value={{ darkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}; 
import React, { createContext, useContext, useEffect } from 'react';

const DarkModeContext = createContext();

export const useDarkMode = () => {
  const context = useContext(DarkModeContext);
  if (!context) {
    throw new Error('useDarkMode must be used within a DarkModeProvider');
  }
  return context;
};

export const DarkModeProvider = ({ children }) => {
  const theme = 'light';
  const isDarkMode = false;
  const toggleTheme = () => {};

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('dark-mode');
    localStorage.setItem('theme', 'light');
  }, []);

  const value = {
    theme,
    isDarkMode,
    toggleTheme,
  };

  return (
    <DarkModeContext.Provider value={value}>
      {children}
    </DarkModeContext.Provider>
  );
};

// store/ThemeContext.tsx
import React, { createContext, ReactNode, useContext, useMemo, useState } from 'react';


export const lightTheme = {
  colors: {
    background: '#ffffff',
    cardBackground: '#f9f9f9',
    text: '#1a1a1a',
    subtleText: '#666666',
    border: '#eeeeee',
    primary: '#007aff',
    success: '#28a745',
    warning: '#ff9800',
    disabled: '#a3d9b8',
  },
  statusBarStyle: 'dark', 
};

export const darkTheme = {
  colors: {
    background: '#121212',
    cardBackground: '#1e1e1e',
    text: '#ffffff',
    subtleText: '#b3b3b3',
    border: '#333333',
    primary: '#90bfff', 
    success: '#4caf50',
    warning: '#ffb74d',
    disabled: '#555555',
  },
  statusBarStyle: 'light', 
};

// --- Context Type ---
type Theme = typeof lightTheme;
type ThemeName = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  themeName: ThemeName;
  toggleTheme: () => void;
}


const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [themeName, setThemeName] = useState<ThemeName>('light');

  const theme = useMemo(() => (themeName === 'light' ? lightTheme : darkTheme), [themeName]);

  const toggleTheme = () => {
    setThemeName(prevName => (prevName === 'light' ? 'dark' : 'light'));
  };

  const contextValue = useMemo(() => ({
    theme,
    themeName,
    toggleTheme,
  }), [theme, themeName]);

  return (
    <ThemeContext.Provider value={contextValue}>
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
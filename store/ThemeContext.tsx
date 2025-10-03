
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';


const THEME_STORAGE_KEY = '@app_theme';

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


type Theme = typeof lightTheme;
type ThemeName = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  themeName: ThemeName;
  toggleTheme: () => void;
}


const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [themeName, setThemeName] = useState<ThemeName | null>(null);


  useEffect(() => {
    const loadTheme = async () => {
      try {
        const storedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (storedTheme === 'light' || storedTheme === 'dark') {
          setThemeName(storedTheme);
        } else {
          setThemeName('light');
        }
      } catch (error) {
        console.error('Failed to load theme from storage:', error);
        setThemeName('light'); // Fallback
      }
    };
    loadTheme();
  }, []);


  useEffect(() => {
    if (themeName !== null) {
      AsyncStorage.setItem(THEME_STORAGE_KEY, themeName)
        .catch(error => console.error('Failed to save theme to storage:', error));
    }
  }, [themeName]);



  const theme = useMemo(() => (themeName === 'light' ? lightTheme : darkTheme), [themeName]);

  const toggleTheme = () => {
    setThemeName(prevName => (prevName === 'light' ? 'dark' : 'light'));
  };

 
  const contextValue = useMemo(() => ({
    theme,
    themeName: (themeName || 'light') as ThemeName, 
    toggleTheme,
  }), [theme, themeName]);


  if (themeName === null) {
    return null; 
  }

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

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Theme {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  backgroundAlt: string;
  text: string;
  textSecondary: string;
  grey: string;
  card: string;
  border: string;
  success: string;
  warning: string;
  error: string;
}

const lightTheme: Theme = {
  primary: '#007AFF',
  secondary: '#5856D6',
  accent: '#34C759',
  background: '#FFFFFF',
  backgroundAlt: '#F2F2F7',
  text: '#000000',
  textSecondary: '#8E8E93',
  grey: '#C7C7CC',
  card: '#FFFFFF',
  border: '#E5E5EA',
  success: '#34C759',
  warning: '#FF9500',
  error: '#FF3B30',
};

const darkTheme: Theme = {
  primary: '#0A84FF',
  secondary: '#5E5CE6',
  accent: '#30D158',
  background: '#000000',
  backgroundAlt: '#1C1C1E',
  text: '#FFFFFF',
  textSecondary: '#8E8E93',
  grey: '#48484A',
  card: '#1C1C1E',
  border: '#38383A',
  success: '#30D158',
  warning: '#FF9F0A',
  error: '#FF453A',
};

interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
  setThemeMode: (mode: 'light' | 'dark' | 'system') => void;
  themeMode: 'light' | 'dark' | 'system';
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeMode] = useState<'light' | 'dark' | 'system'>('system');
  const [isDark, setIsDark] = useState(systemColorScheme === 'dark');

  useEffect(() => {
    loadThemePreference();
  }, []);

  useEffect(() => {
    if (themeMode === 'system') {
      setIsDark(systemColorScheme === 'dark');
    } else {
      setIsDark(themeMode === 'dark');
    }
  }, [themeMode, systemColorScheme]);

  const loadThemePreference = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('themeMode');
      if (savedTheme) {
        setThemeMode(savedTheme as 'light' | 'dark' | 'system');
      }
    } catch (error) {
      console.log('Error loading theme preference:', error);
    }
  };

  const saveThemePreference = async (mode: 'light' | 'dark' | 'system') => {
    try {
      await AsyncStorage.setItem('themeMode', mode);
    } catch (error) {
      console.log('Error saving theme preference:', error);
    }
  };

  const toggleTheme = () => {
    const newMode = isDark ? 'light' : 'dark';
    setThemeMode(newMode);
    saveThemePreference(newMode);
  };

  const handleSetThemeMode = (mode: 'light' | 'dark' | 'system') => {
    setThemeMode(mode);
    saveThemePreference(mode);
  };

  const theme = isDark ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider
      value={{
        theme,
        isDark,
        toggleTheme,
        setThemeMode: handleSetThemeMode,
        themeMode,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

import React, { createContext, useContext, useEffect, useState } from 'react';

type ThemeMode = 'dark' | 'light';
type ThemeAccent = 'emerald' | 'cyan' | 'indigo' | 'amber';

interface ThemeContextType {
  mode: ThemeMode;
  accent: ThemeAccent;
  toggleTheme: () => void;
  setMode: (mode: ThemeMode) => void;
  setAccent: (accent: ThemeAccent) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setModeState] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('vitech_theme_mode');
    if (saved === 'light' || saved === 'dark') return saved;
    return 'dark'; // default to high-end tech dark mode
  });

  const [accent, setAccentState] = useState<ThemeAccent>(() => {
    const saved = localStorage.getItem('vitech_theme_accent');
    if (saved === 'emerald' || saved === 'cyan' || saved === 'indigo' || saved === 'amber') return saved;
    return 'emerald'; // African innovation emerald default
  });

  useEffect(() => {
    const root = document.documentElement;
    if (mode === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('vitech_theme_mode', mode);
  }, [mode]);

  useEffect(() => {
    localStorage.setItem('vitech_theme_accent', accent);
  }, [accent]);

  const toggleTheme = () => {
    setModeState((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const setMode = (newMode: ThemeMode) => {
    setModeState(newMode);
  };

  const setAccent = (newAccent: ThemeAccent) => {
    setAccentState(newAccent);
  };

  return (
    <ThemeContext.Provider value={{ mode, accent, toggleTheme, setMode, setAccent }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

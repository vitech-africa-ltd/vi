import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

export type ThemeMode = 'dark' | 'light';
export type ThemePreference = 'system' | 'dark' | 'light';
export type ThemeAccent = 'emerald' | 'cyan' | 'indigo' | 'amber';

interface ThemeContextType {
  mode: ThemeMode;
  preference: ThemePreference;
  accent: ThemeAccent;
  isSystemMode: boolean;
  toggleTheme: () => void;
  setMode: (mode: ThemeMode) => void;
  setPreference: (pref: ThemePreference) => void;
  setAccent: (accent: ThemeAccent) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Helper to read system OS preference
  const getSystemTheme = (): ThemeMode => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'dark'; // High-tech tech default fallback
  };

  const [preference, setPreferenceState] = useState<ThemePreference>(() => {
    if (typeof window === 'undefined') return 'system';
    const saved = localStorage.getItem('vitech_theme_preference') || localStorage.getItem('vitech_theme_mode');
    if (saved === 'light' || saved === 'dark' || saved === 'system') return saved as ThemePreference;
    return 'system'; // Auto-detect OS system preference by default
  });

  const [systemTheme, setSystemTheme] = useState<ThemeMode>(getSystemTheme);

  // Compute current effective mode
  const mode: ThemeMode = preference === 'system' ? systemTheme : preference;

  const [accent, setAccentState] = useState<ThemeAccent>(() => {
    if (typeof window === 'undefined') return 'emerald';
    const saved = localStorage.getItem('vitech_theme_accent');
    if (saved === 'emerald' || saved === 'cyan' || saved === 'indigo' || saved === 'amber') return saved;
    return 'emerald'; // African innovation emerald default
  });

  // Listen to OS system color scheme changes in real-time
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? 'dark' : 'light');
    };

    // Initial check
    setSystemTheme(mediaQuery.matches ? 'dark' : 'light');

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } else if (mediaQuery.addListener) {
      // Legacy fallback
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, []);

  // Synchronize CSS class and data-theme with document.documentElement
  useEffect(() => {
    const root = document.documentElement;
    if (mode === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
      root.setAttribute('data-theme', 'dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
      root.setAttribute('data-theme', 'light');
      root.style.colorScheme = 'light';
    }
  }, [mode]);

  // Persist preference
  useEffect(() => {
    localStorage.setItem('vitech_theme_preference', preference);
    localStorage.setItem('vitech_theme_mode', mode);
  }, [preference, mode]);

  // Persist accent
  useEffect(() => {
    localStorage.setItem('vitech_theme_accent', accent);
  }, [accent]);

  const toggleTheme = useCallback(() => {
    setPreferenceState((prev) => {
      if (prev === 'system') {
        return systemTheme === 'dark' ? 'light' : 'dark';
      }
      return prev === 'dark' ? 'light' : 'dark';
    });
  }, [systemTheme]);

  const setMode = useCallback((newMode: ThemeMode) => {
    setPreferenceState(newMode);
  }, []);

  const setPreference = useCallback((newPref: ThemePreference) => {
    setPreferenceState(newPref);
  }, []);

  const setAccent = useCallback((newAccent: ThemeAccent) => {
    setAccentState(newAccent);
  }, []);

  return (
    <ThemeContext.Provider
      value={{
        mode,
        preference,
        accent,
        isSystemMode: preference === 'system',
        toggleTheme,
        setMode,
        setPreference,
        setAccent,
      }}
    >
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

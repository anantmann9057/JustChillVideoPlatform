import { createContext, useContext, useState, useEffect } from 'react';

// 1. Create the context
const ThemeContext = createContext();

// 2. Create the provider
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light'); // default theme

  // Optional: Save theme to localStorage
  useEffect(() => {
    const storedTheme = localStorage.getItem('app-theme');
    if (storedTheme) {
      setTheme(storedTheme);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('app-theme', theme);
    document.body.setAttribute('data-theme', theme); // for setting theme class on body
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// 3. Custom hook to use the context easily
export function useTheme() {
  return useContext(ThemeContext);
}

import React, { createContext, useContext, useState } from 'react';

// Define light and dark themes
const themes = {
  light: {
    colors: {
      primary: '#007bff',
      secondary: '#6c757d',
      background: '#f8f9fa',
      itemBackground: '#f9f9f9',
      borderColor: '#ddd',
      text: '#333',
      buttonText: '#ffffff',
    },
    buttonStyles: {
      backgroundColor: '#007bff',
      padding: 10,
      borderRadius: 5,
      borderWidth: 1,
      borderColor: '#ddd',
    },
    // Define other styles for light theme
  },
  dark: {
    colors: {
      primary: '#17a2b8',
      secondary: '#343a40',
      background: '#343a40',
      itemBackground: '#495057',
      borderColor: '#ced4da',
      text: '#f8f9fa',
      buttonText: '#343a40',
    },
    buttonStyles: {
      backgroundColor: '#17a2b8',
      padding: 10,
      borderRadius: 5,
      borderWidth: 1,
      borderColor: '#ced4da',
    },
    // Define other styles for dark theme
  }
};

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(themes.light); // Default theme is light

  const toggleTheme = () => {
    setTheme(theme === themes.light ? themes.dark : themes.light);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

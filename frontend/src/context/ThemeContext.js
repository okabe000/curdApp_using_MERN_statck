import React, { createContext, useContext, useState } from 'react';

// Define the initial themes
const themes = {
  light: {
    colors: {
      background: '#FFFFFF',
      text: '#000000',
      buttonBackground: '#E7AD99',
      buttonTextColor: '#FFFFFF',
      border: '#495867',
      disabledButtonColor: 'gray',
    },
  },
  dark: {
    colors: {
      background: '#121212',
      text: '#FFFFFF',
      buttonBackground: '#E7AD99',
      buttonTextColor: '#FFFFFF',
      border: '#495867',
      disabledButtonColor: 'gray',
    },
  },
};

// Create the Theme Context
const ThemeContext = createContext();

// Create a hook to consume the theme
export const useTheme = () => useContext(ThemeContext);

// Create a Theme Provider component
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(themes.light);

  // Function to update the theme
  const updateTheme = (themeName) => {
    setTheme(themes[themeName]);
  };

  return (
    <ThemeContext.Provider value={{ theme, updateTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

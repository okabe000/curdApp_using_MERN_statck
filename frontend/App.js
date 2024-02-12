import React from 'react';
import AuthGateNavigator from './src/navigation/AuthGateNavigator';
import { AuthProvider } from './src/context/AuthContext';
import { ThemeProvider } from './src/context/ThemeContext';

// import 'react-native-gesture-handler';


if (global.HermesInternal) {
  console.log('Hermes is enabled');
} else {
  console.log('Hermes is not enabled');
}

export default function App() {
  return (
    <AuthProvider>
          <ThemeProvider>
            <AuthGateNavigator />
        </ThemeProvider>
    </AuthProvider>
  );
};
import React from 'react';
import AuthGateNavigator from './src/navigation/AuthGateNavigator';
import { AuthProvider } from './src/context/AuthContext';


export default function App() {
  return (
    <AuthProvider>
      <AuthGateNavigator />
    </AuthProvider>
  );
};
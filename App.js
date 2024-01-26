import React from 'react';
import AuthGateNavigator from './src/navigation/AuthGateNavigator';
import { AuthProvider } from './src/context/AuthContext';

// import 'react-native-gesture-handler';



export default function App() {
  return (
    <AuthProvider>
      <AuthGateNavigator />
    </AuthProvider>
  );
};
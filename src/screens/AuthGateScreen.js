import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';

const AuthTab = createMaterialTopTabNavigator();

function AuthGateScreen() {
  return (
    <AuthTab.Navigator>
      <AuthTab.Screen name="Login" component={LoginScreen} />
      <AuthTab.Screen name="Register" component={RegisterScreen} />
    </AuthTab.Navigator>
  );
}

export default AuthGateScreen;

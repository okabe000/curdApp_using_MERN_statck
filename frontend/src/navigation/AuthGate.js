import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';

import AuthUsersNavigator from './AuthUsersNavigator';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';

const Tab = createBottomTabNavigator();

const AuthTabs = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Login" component={LoginScreen} />
      <Tab.Screen name="Register" component={RegisterScreen} />
    </Tab.Navigator>
  );
};


const AuthGate = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
  
    useEffect(() => {
      const checkAuthStatus = async () => {
        const token = await AsyncStorage.getItem('userToken');
        setIsAuthenticated(!!token);
        setIsLoading(false);
      };
  
      checkAuthStatus();
    }, []);
  
    if (isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" /> {/* Customize the color as needed */}
        </View>
      );
    }
  
    return isAuthenticated ? <AuthUsersNavigator /> : <NavigationContainer><AuthTabs /></NavigationContainer>;
  };

  const styles = StyleSheet.create({
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
export default AuthGate;

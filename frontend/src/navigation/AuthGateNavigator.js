import React, { useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import AuthGateScreen from '../screens/AuthGateScreen'; // Your authentication screen with login/register tabs
import MainAppNavigator from './MainAppNavigator'; // Your main app navigator
import { AuthContext } from '../context/AuthContext';

const AuthGateNavigator = () => {
  const { userToken } = useContext(AuthContext);

  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = await AsyncStorage.getItem('userToken');
      console.log("user has a token:",token)
    };

    checkAuthStatus();
  }, []);

  return (
    <NavigationContainer>
      {userToken  ? <MainAppNavigator /> : <AuthGateScreen />}
    </NavigationContainer>
  );
};

export default AuthGateNavigator;

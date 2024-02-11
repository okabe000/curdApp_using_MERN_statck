import React, { useState, useEffect } from 'react';
import { Keyboard, useColorScheme } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

import ProfileScreen from '../screens/ProfileScreen';
import EditItemScreen from '../screens/EditItemScreen';
import ItemsScreen from '../screens/ItemsScreen';
import AddItemScreen from '../screens/AddItemScreen';
import PreviewItemScreen from '../screens/PreviewItemScreen';
import LeaderboardScreen from '../screens/LeaderboardScreen';
import ChangeUserPasswordScreen from '../screens/ChangeUserPasswordScreen';
import { themes } from '../utils/themesCenterlized';

const ProfileStack = createStackNavigator();
const ItemsStack = createStackNavigator();
const LeaderboardStack = createStackNavigator();
const Tab = createBottomTabNavigator();

function ProfileStackScreen() {
  return (
    <ProfileStack.Navigator>
      <ProfileStack.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={{ headerShown: false }}
      />
      <ProfileStack.Screen
        name="EditItemScreen"
        component={EditItemScreen}
        options={{ headerShown: false }}
      />
      <ProfileStack.Screen
        name="ChangeUserPasswordScreen"
        component={ChangeUserPasswordScreen}
        options={{ headerShown: false }}
      />
    </ProfileStack.Navigator>
  );
}

function ItemsStackScreen() {
  return (
    <ItemsStack.Navigator>
      <ItemsStack.Screen
        name="ItemsScreen"
        component={ItemsScreen}
        options={{ headerShown: false }}
      />
      <ItemsStack.Screen
        name="AddItemScreen"
        component={AddItemScreen}
        options={{ headerShown: false }}
      />
      <ItemsStack.Screen
        name="PreviewItemScreen"
        component={PreviewItemScreen}
        options={{ headerShown: false }}
      />
    </ItemsStack.Navigator>
  );
}

function LeaderboardStackScreen() {
  return (
    <LeaderboardStack.Navigator>
      <LeaderboardStack.Screen
        name="LeaderboardScreen"
        component={LeaderboardScreen}
        options={{ headerShown: false }}
      />
    </LeaderboardStack.Navigator>
  );
}

function MainAppNavigator() {
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
      setKeyboardVisible(true);
    });
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardVisible(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const colorScheme = useColorScheme();
  const theme = themes[colorScheme] || themes.light;

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarStyle: {
          backgroundColor: theme.colorsPalette.navTabBG,
          display: keyboardVisible ? 'none' : 'flex',
        },
        tabBarActiveTintColor: theme.colorsPalette.navTabActive,
        tabBarInactiveTintColor: theme.colorsPalette.navTabInActive,
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'ProfileStackScreen') {
            iconName = 'person';
          } else if (route.name === 'ItemsStackScreen') {
            iconName = 'cart';
          } else if (route.name === 'LeaderboardStackScreen') {
            iconName = 'trophy';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="ProfileStackScreen" component={ProfileStackScreen} options={{ headerShown: false }} />
      <Tab.Screen name="ItemsStackScreen" component={ItemsStackScreen} options={{ headerShown: false }} />
      <Tab.Screen name="LeaderboardStackScreen" component={LeaderboardStackScreen} options={{ headerShown: false }} />
    </Tab.Navigator>
  );
}

export default MainAppNavigator;

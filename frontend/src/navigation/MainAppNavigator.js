import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import ProfileScreen from '../screens/ProfileScreen';
import EditItemScreen from '../screens/EditItemScreen';
import ItemsScreen from '../screens/ItemsScreen';
import AddItemScreen from '../screens/AddItemScreen';
import PreviewItemScreen from '../screens/PreviewItemScreen';
import LeaderboardScreen from '../screens/LeaderboardScreen';
import ChangeUserPasswordScreen from '../screens/ChangeUserPasswordScreen';

const ProfileStack = createStackNavigator();
const ItemsStack = createStackNavigator();
const LeaderboardStack = createStackNavigator();
const Tab = createBottomTabNavigator();

function ProfileStackScreen() {
  return (
    <ProfileStack.Navigator>
      <ProfileStack.Screen name="ProfileScreen" component={ProfileScreen} />
      <ProfileStack.Screen name="EditItemScreen" component={EditItemScreen} />
      <ProfileStack.Screen name="ChangeUserPasswordScreen" component={ChangeUserPasswordScreen} />
    </ProfileStack.Navigator>
  );
}

function ItemsStackScreen() {
  return (
    <ItemsStack.Navigator>
      <ItemsStack.Screen name="ItemsScreen" component={ItemsScreen} />
      <ItemsStack.Screen name="AddItemScreen" component={AddItemScreen} />
      <ItemsStack.Screen name="PreviewItemScreen" component={PreviewItemScreen} />
    </ItemsStack.Navigator>
  );
}

function LeaderboardStackScreen() {
  return (
    <LeaderboardStack.Navigator>
      <LeaderboardStack.Screen name="LeaderboardScreen" component={LeaderboardScreen} />
    </LeaderboardStack.Navigator>
  );
}

function MainAppNavigator() {
  return (
      <Tab.Navigator>
        <Tab.Screen name="ProfileStackScreen" AddItemScreen  component={ProfileStackScreen} options={{ headerShown: false }} />
        <Tab.Screen name="ItemsStackScreen" component={ItemsStackScreen} options={{ headerShown: false }}/>
        <Tab.Screen name="LeaderboardStackScreen" component={LeaderboardStackScreen} options={{ headerShown: false }} />
      </Tab.Navigator>
  );
}

export default MainAppNavigator;

import React from 'react';
import { createAppContainer } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createStackNavigator } from 'react-navigation-stack';
import ProfileScreen from '../screens/ProfileScreen';
import EditItemScreen from '../screens/EditItemScreen';
import ItemsScreen from '../screens/ItemsScreen';
import AddItemScreen from '../screens/AddItemScreen';
import PreviewItemScreen from '../screens/PreviewItemScreen';
import LeaderboardScreen from '../screens/LeaderboardScreen';

const ProfileStack = createStackNavigator({
  Profile: ProfileScreen,
  EditItem: EditItemScreen,
});

const ItemsStack = createStackNavigator({
  Items: ItemsScreen,
  AddItem: AddItemScreen,
  PreviewItem: PreviewItemScreen,
});

const TabNavigator = createBottomTabNavigator({
  Profile: ProfileStack,
  Items: ItemsStack,
  Leaderboard: LeaderboardScreen,
});

export default createAppContainer(TabNavigator);

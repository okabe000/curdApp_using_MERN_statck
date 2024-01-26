import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, Button } from 'react-native';
import { serverDest } from '../config';
import { AuthContext } from '../context/AuthContext';

const ProfileScreen = ({ navigation }) => {
  const [userItems, setUserItems] = useState([]);
  const { userId, signOut } = useContext(AuthContext); // Get userId and signOut method from context

  const handleRefresh = () => {
    loadUserItems();
  };

  const loadUserItems = async () => {
    if (userId) {
      await fetchUserItems(userId);
    }
  };

  const handleSignOut = async () => {
    await signOut();
  };

  useEffect(() => {
    loadUserItems();
  }, [userId]); // Dependency array includes userId

  const fetchUserItems = async (userId) => {
    try {
      const response = await fetch(`${serverDest}/api/users/${userId}/items`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const items = await response.json();
      setUserItems(items);
    } catch (error) {
      console.error('Error fetching user items:', error);
    }
  };

  // Render user items or a message if there are none
  const renderUserItems = () => {
    if (userItems.length === 0) {
      return <Text>No items found.</Text>;
    }

    return userItems.map((item, index) => (
      <View key={index} style={styles.itemContainer}>
        <Text style={styles.itemText}>{item.name}</Text>
        {/* Render more item properties as needed */}
      </View>
    ));
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {renderUserItems()}
      <Button title="Refresh" onPress={handleRefresh} />
      <Button title="Sign Out" onPress={handleSignOut} />
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 20,
  },
  itemContainer: {
    width: '100%',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  itemText: {
    fontSize: 16,
    color: '#333',
  },
  // Add more styles as needed
});

export default ProfileScreen;

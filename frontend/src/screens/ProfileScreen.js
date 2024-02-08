import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, StyleSheet, RefreshControl, Button, Alert } from 'react-native';
import { serverDest } from '../config';
import { AuthContext } from '../context/AuthContext';

const ProfileScreen = ({ navigation }) => {
  const [userItems, setUserItems] = useState([]);
  const [userScore, setUserScore] = useState(0);
  const [userCategory, setUserCategory] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { userId } = useContext(AuthContext);


    // Move 'loadUserProfile' outside useEffect to make it available in the component's scope
    const loadUserProfile = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${serverDest}/api/users/${userId}/profile`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const profileData = await response.json();
  
        setUserScore(profileData.score);
        setUserCategory(profileData.category);
        setUserItems(profileData.items); 
        console.log("Fetched user profile data:", profileData);

      } catch (error) {
        Alert.alert("Error", `Failed to fetch profile data: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    };
    useEffect(() => {
      loadUserProfile();
    }, [userId]); // Dependency array ensures this effect runs only when userId changes
  
  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemText}>{item.name}</Text>
      <Button
        title="Edit"
        onPress={() => navigation.navigate('EditItemScreen', { item })}
      />
    </View>
  );

  return (
    <View style={styles.mainContainer}>
      <View style={styles.userInfoContainer}>
        <Text style={styles.userInfoLabel}>Score: </Text>
        <Text style={styles.userInfoValue}>{userScore}</Text>
      </View>
      <FlatList
        data={userItems}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={loadUserProfile} />
        }
        ListEmptyComponent={<Text>No items found.</Text>}
      />
            <Button title="Refresh" onPress={loadUserProfile} />


      <Button title="Change Password" onPress={() => navigation.navigate('ChangePasswordScreen')} />
      <Button title="Update Username" onPress={() => navigation.navigate('UpdateUsernameScreen')} />
    </View>
  );
};
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  listContainer: {
    flexGrow: 1,
    padding: 20,
  },
  itemContainer: {
    padding: 10,
    marginVertical: 8,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  itemText: {
    fontSize: 16,
    color: '#333',
  },
  // Add more styles as needed
});

export default ProfileScreen;

import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl, Button, Alert, useColorScheme, ActivityIndicator } from 'react-native';
import { serverDest } from '../config';
import { AuthContext } from '../context/AuthContext';
import { themes } from '../utils/themesCenterlized';

const ProfileScreen = ({ navigation }) => {
  const colorScheme = useColorScheme();
  const theme = themes[colorScheme] || themes.light;
  const styles = getStyles(theme);

  const [userItems, setUserItems] = useState([]);
  const [userScore, setUserScore] = useState(0);
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(true); // Start as loading
  const { userId, signOut } = useContext(AuthContext);

  useEffect(() => {
    if (userId) { // Only proceed if userId is available
      loadUserProfile();
    } else {
      setIsLoading(false); // If no userId, stop loading (might indicate not logged in)
    }
  }, [userId]);

  const loadUserProfile = async () => {
    try {
      const response = await fetch(`${serverDest}/api/users/${userId}/profile`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const profileData = await response.json();

      setUserScore(profileData.score);
      setUserItems(profileData.items);
      setUsername(profileData.username);
    } catch (error) {
      Alert.alert("Error", `Failed to fetch profile data: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading || !userId) { // Check for isLoading or if userId is not available
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }


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
      <Text>Username: {username}</Text>

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
      <Button title="Change Password" onPress={() => navigation.navigate('ChangeUserPasswordScreen')} />
      <Button title="Update Username" onPress={() => navigation.navigate('UpdateUsernameScreen')} />
      <Button title="Sign Out" onPress={signOut} color="red" />
    </View>
  );
};

const getStyles = (theme) => StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: theme.background,
  },
  listContainer: {
    flexGrow: 1,
    padding: 20,
  },
  itemContainer: {
    padding: 10,
    marginVertical: 8,
    backgroundColor: theme.background,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  itemText: {
    fontSize: 16,
    color: '#333',
  },
  userInfoLabel: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  userInfoValue: {
    fontSize: 18,
  },
  // Add more styles as needed
});

export default ProfileScreen;

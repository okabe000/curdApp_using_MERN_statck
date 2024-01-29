import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, StyleSheet, RefreshControl, Button ,Alert} from 'react-native';
import { serverDest } from '../config';
import { AuthContext } from '../context/AuthContext';

const ProfileScreen = ({ navigation }) => {
  const [userItems, setUserItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { userId } = useContext(AuthContext);

  useEffect(() => {
    loadUserItems();
  }, [userId]);

  const loadUserItems = async () => {
    setIsLoading(true);
    try {
        const response = await fetch(`${serverDest}/api/users/${userId}/items`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setUserItems(data);

        // Log the fetched items
        console.log('Fetched Items:', data);
        console.log('user ID:', userId);
        console.log('endpoint :', `${serverDest}/api/users/${userId}/items`);
    } catch (error) {
        Alert.alert("Error", `Failed to fetch items: ${error.message}`);
    } finally {
        setIsLoading(false);
    }
};
const renderItem = ({ item }) => (
  <View style={styles.itemContainer}>
    <Text style={styles.itemText}>{item.name}</Text>
    {/* Add other item details here */}
    <Button
      title="Edit"
      onPress={() => navigation.navigate('EditItemScreen', { item })}
    />
  </View>
);

  return (
    <View style={styles.mainContainer}>
      <FlatList
        data={userItems}
        renderItem={renderItem}
        keyExtractor={item => item._id.toString()} // Replace _id with your unique identifier
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={loadUserItems} />
        }
        ListEmptyComponent={<Text>No items found.</Text>}
      />
      <Button title="Refresh" onPress={loadUserItems} />
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

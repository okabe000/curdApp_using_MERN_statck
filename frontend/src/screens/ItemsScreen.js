import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl, TouchableOpacity, Image } from 'react-native';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ItemsScreen = () => {
  const [items, setItems] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    fetchAndCacheItems();
    requestAndSetLocation();
  }, []);

  const fetchAndCacheItems = async () => {
    setRefreshing(true);
    try {
      // Replace 'YOUR_API_ENDPOINT' with your actual API endpoint
      const response = await fetch('YOUR_API_ENDPOINT');
      const data = await response.json();
      await AsyncStorage.setItem('items', JSON.stringify(data)); // Cache items
      setItems(data);
    } catch (error) {
      console.error('Error fetching items:', error);
      // Load cached items if fetch fails
      const cachedItems = await AsyncStorage.getItem('items');
      if (cachedItems) setItems(JSON.parse(cachedItems));
    } finally {
      setRefreshing(false);
    }
  };

  const requestAndSetLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.error('Permission to access location was denied');
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    setUserLocation({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    });
  };

  const calculateDistance = (itemLocation) => {
    if (!userLocation || !itemLocation || !itemLocation.coordinates) {
      return 'N/A';
    }
    // Simplified distance calculation (straight line)
    const distance = Math.sqrt(
      Math.pow(userLocation.latitude - itemLocation.coordinates[0], 2) +
      Math.pow(userLocation.longitude - itemLocation.coordinates[1], 2)
    );
    return `${distance.toFixed(2)} km`;
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      {item.image && <Image source={{ uri: item.image }} style={styles.itemImage} />}
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemDescription}>{item.description}</Text>
        <Text style={styles.distanceText}>
          {item.location ? calculateDistance(item.location) : 'N/A'}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={items.sort((a, b) => {
          if (!a.location || !b.location) return 1; // Sort items with no location to the end
          return calculateDistance(a.location) - calculateDistance(b.location);
        })}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchAndCacheItems} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  itemContainer: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  itemImage: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontWeight: 'bold',
  },
  itemDescription: {},
  distanceText: {},
});

export default ItemsScreen;

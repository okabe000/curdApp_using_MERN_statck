// Imports
import React, { useEffect, useLayoutEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl, Button } from 'react-native';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { serverDest } from '../config';
import { AuthContext } from '../context/AuthContext'

// ItemsScreen component
const ItemsScreen = ({ navigation }) => {
  const { userCategory } = useContext(AuthContext); // Consume the userCategory from context

  const [items, setItems] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [userLocation, setUserLocation] = useState(null);

  const useItems = () => {
    const fetchAndCacheItems = async () => {
      setRefreshing(true);
      try {
        const response = await fetch(`${serverDest}/api/items`);
        const data = await response.json();
        await AsyncStorage.setItem('items', JSON.stringify(data));
        setItems(data);
      } catch (error) {
        console.error("Error fetching items:", error);
        const cachedItems = await AsyncStorage.getItem('items');
        if (cachedItems) setItems(JSON.parse(cachedItems));
      } finally {
        setRefreshing(false);
      }
    };

    useEffect(() => {
      fetchAndCacheItems();
    }, []);

    return fetchAndCacheItems;
  };

  const useUserLocation = () => {
    useEffect(() => {
      const requestAndSetLocation = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          console.warn("Location permission denied");
          return;
        }

        let location = await Location.getCurrentPositionAsync({});
        setUserLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      };

      requestAndSetLocation();
    }, []);
  };

  useItems();
  useUserLocation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        userCategory === 'provider' ? (
          <Button
            onPress={() => navigation.navigate('AddItemScreen')}
            title="Add Item"
          />
        ) : null
      ),
    });
  }, [navigation, userCategory]); // Add userCategory as a dependency
  
  // Simplified distance calculation
  const calculateDistance = (itemLocation) => {
    if (!userLocation || !itemLocation || !itemLocation.coordinates) {
      return 'N/A';
    }
    const distance = Math.sqrt(
      Math.pow(userLocation.latitude - itemLocation.coordinates[0], 2) +
      Math.pow(userLocation.longitude - itemLocation.coordinates[1], 2)
    );
    return `${distance.toFixed(2)} km`;
  };

  // Render item view

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemDescription}>{item.description}</Text>
        <Text style={styles.distanceText}>
          {item.location ? calculateDistance(item.location) : 'N/A'}
        </Text>
        {userCategory === 'claimer' && (
          <Button
            onPress={() => {/* Logic to handle claim action */}}
            title="Claim"
          />
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        keyExtractor={(item) => item._id.toString()}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={useItems}
          />
        }
      />
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: { flex: 1 },
  itemContainer: { flexDirection: 'row', padding: 10, borderBottomWidth: 1, borderBottomColor: '#ddd' },
  itemInfo: { flex: 1 },
  itemName: { fontWeight: 'bold' },
  itemDescription: {},
  distanceText: {},
});

export default ItemsScreen;

// Import necessary modules and components
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl, TextInput, TouchableOpacity, Image } from 'react-native';
import * as Location from 'expo-location'; // Import Expo's Location module
import { serverDest } from '../config'; // Import server destination configuration
import Icon from 'react-native-vector-icons/MaterialIcons';

const ItemsScreen = ({ navigation }) => {
  // State variables
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [sortAscending, setSortAscending] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [userLocation, setUserLocation] = useState(null);

  // Constants
  const ITEM_LIMIT = 15;

  // Fetch items and request location permission on component mount
  useEffect(() => {
    requestLocationPermission();
    fetchItems();
  }, []);


  // Function to calculate distances for each item
// Function to calculate distances for each item
const updateDistances = () => {
  if (userLocation && items.length > 0) {
    const updatedItems = items.map(item => {
      let distance = calculateDistance(userLocation, item.location);
      console.log(`Updated distance for item: ${distance}`);
      return { ...item, distance };
    });

    setFilteredItems(updatedItems);
  }
};
  
  // Effect hook to watch for changes in userLocation
  useEffect(() => {
    if (userLocation) {
      updateDistances();
    }
  }, [userLocation, items]);
  
  // Request location permission using Expo's Location module
  const requestLocationPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status === 'granted') {
      console.log('Location permission granted');
      getCurrentLocation();
    } else {
      console.log('Location permission denied');
    }
  };

  const getCurrentLocation = async () => {
    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
        timeout: 5000
      });
      if (location) {
        const newUserLocation = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        };
        setUserLocation(newUserLocation);
      } else {
        setUserLocation(null); // Location not available
      }
    } catch (error) {
      console.error('Error getting user location:', error);
      setUserLocation(null); // Error getting location
    }
  };
  
  
  // Log the user's location whenever it changes
  useEffect(() => {
    console.log('User Location:', userLocation);
  }, [userLocation]);

  // Fetch items from the server
  useEffect(() => {
    fetchItems();
  }, []);

  // Update filtered items when items change
  useEffect(() => {
    setFilteredItems(items);
  }, [items]);

  useEffect(() => {
    setFilteredItems(items);
  }, [items]);

  // Fetch items from the server
// Fetch items from the server
const fetchItems = async () => {
  setRefreshing(true);
  try {
    const response = await fetch(`${serverDest}/api/items`);
    const data = await response.json();
    if (Array.isArray(data) && data.length > 0) {
      setItems(data);
  
      // Log the location of the last item
      const lastItem = data[data.length - 1];
      console.log("Last item location:", lastItem.location);
      
      // Calculate distances for items
      updateDistances();
    } else if (data && data.error) {
      console.error('API Error:', data.error);
    } else {
      console.error('Received unexpected data format:', data);
    }
    setRefreshing(false);
  } catch (error) {
    console.error('Error fetching items:', error);
    setRefreshing(false);
  }
};

  // Sort items based on name in ascending or descending order
  const sortItems = () => {
    const sortedItems = [...filteredItems].sort((a, b) => {
      const nameA = a.name ? a.name.toLowerCase() : '';
      const nameB = b.name ? b.name.toLowerCase() : '';
      return sortAscending ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
    });

    setFilteredItems(sortedItems);
    setSortAscending(!sortAscending);
    setCurrentPage(0);
  };

  // Handle search input and filter items based on the query
  const handleSearch = (query) => {
    setSearchQuery(query);
    const filtered = query.trim() === '' ? items : items.filter(item => item.name && item.name.toLowerCase().includes(query.toLowerCase()));

    setFilteredItems(filtered);
    setCurrentPage(0);
  };

  // Calculate distance between user's location and item's location
  const calculateDistance = (userLocation, itemLocation) => {
    if (!userLocation || !itemLocation || 
      !itemLocation.coordinates || itemLocation.coordinates.length < 2) {
      return 'Location not available';
    }
  
    // Distance calculation logic
    const rad = x => (x * Math.PI) / 180;
    const R = 6371; // Earth's radius in kilometers
    const lat1 = rad(userLocation.latitude);
    const lon1 = rad(userLocation.longitude);
    const lat2 = rad(itemLocation.coordinates[1]);
    const lon2 = rad(itemLocation.coordinates[0]);
  
    const dLon = lon2 - lon1;
    const dLat = lat2 - lat1;
  
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
    const distance = R * c;
    console.log(`Calculated distance for item: ${distance}`);

    return distance.toFixed(2);
  };
  const renderItem = ({ item }) => {
    // console.log("Filtered Items before rendering:", filteredItems);

    let distanceText = item.distance ? `${item.distance} km away` : 'Distance unavailable';

    // Check if the item has an image
    if (item.image) {
      return (
        <View style={styles.itemContainer}>
          <Image source={{ uri: `data:image/jpeg;base64,${item.image}` }} style={styles.itemImage} />
          <View style={styles.itemInfo}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemDescription}>{item.description}</Text>
            <Text style={styles.distanceText}>{distanceText}</Text>
          </View>
        </View>
      );
    } else {
      // Render "No Image" text in dark red
      return (
        <View style={styles.itemContainer}>
          <View style={[styles.itemImage, { backgroundColor: 'darkred', justifyContent: 'center', alignItems: 'center' }]}>
            <Text style={{ color: 'white', fontWeight: 'bold' }}>No Image</Text>
          </View>
          <View style={styles.itemInfo}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemDescription}>{item.description}</Text>
            <Text style={styles.distanceText}>{distanceText}</Text>
          </View>
        </View>
      );
    }
};


  // Get total number of pages for pagination
  const getTotalPages = () => {
    return Math.ceil(filteredItems.length / ITEM_LIMIT);
  };

  // Change the current page for pagination
  const changePage = (offset) => {
    let newPage = currentPage + offset;
    if (newPage < 0) newPage = 0;
    if (newPage >= getTotalPages()) newPage = getTotalPages() - 1;
    setCurrentPage(newPage);
  };

  // Slice items to display for the current page
  const sliceItemsForCurrentPage = () => {
    const start = currentPage * ITEM_LIMIT;
    return filteredItems.slice(start, start + ITEM_LIMIT);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search items"
          value={searchQuery}
          onChangeText={handleSearch}
        />
        <TouchableOpacity style={styles.addItemButton} onPress={() => navigation.navigate('AddItemScreen')}>
          <Text style={styles.addItemButtonText}>Add Item</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.iconBar}>
        <TouchableOpacity onPress={sortItems}>
          <Icon name={sortAscending ? "arrow-upward" : "arrow-downward"} size={20} color="#495867" />
        </TouchableOpacity>
        <TouchableOpacity onPress={fetchItems}>
          <Icon name="refresh" size={20} color="#495867" />
        </TouchableOpacity>
      </View>
      <View style={styles.listContainer}>
        <FlatList
          data={sliceItemsForCurrentPage()}
          keyExtractor={item => item._id.toString()}
          renderItem={renderItem}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchItems} />}
        />
        <View style={styles.pagination}>
          <TouchableOpacity style={styles.button} onPress={() => changePage(-1)} disabled={currentPage === 0}>
            <Text style={[styles.buttonText, currentPage === 0 && styles.disabledButton]}>Previous</Text>
          </TouchableOpacity>
          <Text style={styles.pageNumber}>Page {currentPage + 1} of {getTotalPages()}</Text>
          <TouchableOpacity style={styles.button} onPress={() => changePage(1)} disabled={currentPage >= getTotalPages() - 1}>
            <Text style={[styles.buttonText, currentPage >= getTotalPages() - 1 && styles.disabledButton]}>Next</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'flex-start',
    padding: 2,
    backgroundColor: '#E8BB9C',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderColor: '#495867',
    borderWidth: 1,
    borderRadius: 10,
    paddingLeft: 8,
    backgroundColor: 'white',
  },
  addItemButton: {
    backgroundColor: '#E7AD99',
    padding: 10,
    borderRadius: 10,
    marginLeft: 10,
  },
  addItemButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  iconBar: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingVertical: 10,
  },
  listContainer: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 2,
  },
  itemContainer: {
    padding: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#495867',
    backgroundColor: 'white',
    marginBottom: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemImage: {
    width: 80,
    height: 80,
    marginRight: 10,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#495867',
  },
  itemDescription: {
    fontSize: 14,
    color: '#666',
  },
  distanceText: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  button: {
    backgroundColor: '#C76457',
    padding: 10,
    borderRadius: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  disabledButton: {
    color: 'gray',
  },
  pagination: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '60%',
    marginVertical: 10,
  },
  pageNumber: {
    fontSize: 16,
    color: '#495867',
  },
});

export default ItemsScreen;

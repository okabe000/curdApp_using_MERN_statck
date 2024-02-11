import React, { useEffect, useState, useLayoutEffect, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl, Button, TextInput, TouchableOpacity, Image, useColorScheme } from 'react-native';
import * as Location from 'expo-location';
import { serverDest } from '../config';
import { AuthContext } from '../context/AuthContext';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { themes } from '../utils/themesCenterlized';

import ItemCard from '../components/itemCard'; // Ensure this path is correct

const ITEM_LIMIT = 15;


const ItemsScreen = ({ navigation }) => {
    const colorScheme = useColorScheme();
    const theme = themes[colorScheme] || themes.light;
    const styles = getStyles(theme);

    const { userId } = useContext(AuthContext); // Use userId from AuthContext
    const [userCategory, setUserCategory] = useState(null); // State to hold the fetched user category
    const [items, setItems] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);
    const [sortAscending, setSortAscending] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [userLocation, setUserLocation] = useState(null);

    
    useEffect(() => {
        requestLocationPermission();
        fetchItems();
        fetchUserCategory(); // Fetch the user category when the component mounts

    }, []);

    
    const fetchUserCategory = async () => {
        if (!userId) return; // Ensure there's a userId to fetch category for
        try {
            const response = await fetch(`${serverDest}/api/users/${userId}`, {
                headers: {
                    // Assuming you're using a Bearer token for authorization
                    'Authorization': `Bearer YOUR_ACCESS_TOKEN_HERE`
                }
            });
            const data = await response.json();
            if (response.ok) {
                setUserCategory(data.category); // Set fetched user category
            } else {
                console.error('Failed to fetch user category:', data.message);
            }
        } catch (error) {
            console.error('Error fetching user category:', error);
        }
    };

    useEffect(() => {
        if (userLocation) {
            updateDistances();
        }
    }, [userLocation, items]);

    useEffect(() => {
        console.log('User Location:', userLocation);
    }, [userLocation]);

    // Adjusted useLayoutEffect for conditional rendering based on userCategory
    useEffect(() => {
        if (userCategory === 'provider') {
            navigation.setOptions({
                headerRight: () => (
                    <TouchableOpacity onPress={() => navigation.navigate('AddItemScreen')}>
                        <Icon name="add" size={25} color="#495867" />
                    </TouchableOpacity>
                ),
            });
        } else {
            navigation.setOptions({ headerRight: null });
        }
    }, [navigation, userCategory]);

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
        setUserLocation(null);
      }
    } catch (error) {
      console.error('Error getting user location:', error);
      setUserLocation(null);
    }
  };

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

  const fetchItems = async () => {
    setRefreshing(true);
    try {
      const response = await fetch(`${serverDest}/api/items`);
      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        setItems(data);
        const lastItem = data[data.length - 1];
        console.log("Last item location:", lastItem.location);
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

  const handleSearch = (query) => {
    setSearchQuery(query);
    const filtered = query.trim() === '' ? items : items.filter(item => item.name && item.name.toLowerCase().includes(query.toLowerCase()));
    setFilteredItems(filtered);
    setCurrentPage(0);
  };

  const calculateDistance = (userLocation, itemLocation) => {
    if (!userLocation || !itemLocation || !itemLocation.coordinates || itemLocation.coordinates.length < 2) {
      return 'Location not available';
    }
    const rad = x => (x * Math.PI) / 180;
    const R = 6371;
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
    return (
        <ItemCard
            item={item}
            theme={theme}
            onPressClaim={() => userCategory === 'claimer' && navigation.navigate('ReqClaimScreen', { item })}
            showClaimButton={userCategory === 'claimer'}
        />
    );
};


  const getTotalPages = () => {
    return Math.ceil(filteredItems.length / ITEM_LIMIT);
  };

  const changePage = (offset) => {
    let newPage = currentPage + offset;
    if (newPage < 0) newPage = 0;
    if (newPage >= getTotalPages()) newPage = getTotalPages() - 1;
    setCurrentPage(newPage);
  };

  const sliceItemsForCurrentPage = () => {
    const start = currentPage * ITEM_LIMIT;
    return filteredItems.slice(start, start + ITEM_LIMIT);
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        userCategory === 'provider' ? (
          <Button onPress={() => navigation.navigate('AddItemScreen')} title="Add Item" />
        ) : null
      ),
    });
  }, [navigation, userCategory]);

  return (
    <View style={styles.container}>
                    {userCategory === 'provider' && (
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.navigate('AddItemScreen')}>
                    <Text style={styles.buttonText}>Add Item</Text>
                </TouchableOpacity>
            )}
      <View style={styles.header}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search items"
          value={searchQuery}
          onChangeText={handleSearch}
        />

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
const getStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'flex-start',
    padding: 2,
    backgroundColor: theme.colorsPalette.MainBackground, // Use MainBackground color for page background
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
    borderColor: theme.colorsPalette.SecondaryBackground, // Use SecondaryBackground color for border
    borderWidth: 1,
    borderRadius: 10,
    paddingLeft: 8,
    color: theme.colorsPalette.MainText, // Use MainText color for input text
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
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginVertical: 8,
    backgroundColor: theme.colorsPalette.SecondaryBackground, // Use SecondaryBackground for item background
    borderRadius: 5,
    borderWidth: 1,
    borderColor: theme.colorsPalette.navTabBG, // Use navTabBG color for border
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
    color: theme.colorsPalette.MainText, // Use MainText color for item name
  },
  itemDescription: {
    fontSize: 14,
    color: theme.colorsPalette.SecdText, // Use SecdText color for item description
  },
  distanceText: {
    fontSize: 12,
    color: theme.colorsPalette.SecdText, // Use SecdText color for distance text
    marginTop: 5,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: theme.colorsPalette.navTabActive, // Use navTabActive color for button background
    padding: 10,
    borderRadius: 5,
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
    justifyContent: 'center', // Updated for center alignment
    paddingVertical: 10,
  },
  pageNumber: {
    fontSize: 16,
    color: theme.colorsPalette.MainText, // Use MainText color for page numbers
    marginHorizontal: 10, // Add horizontal margin for spacing
  },
});


export default ItemsScreen;

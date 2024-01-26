import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl, TextInput, TouchableOpacity } from 'react-native';
import { serverDest } from '../config';
import Icon from 'react-native-vector-icons/MaterialIcons'; // or any other set


const ItemsScreen = ({ navigation }) => {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [sortAscending, setSortAscending] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(0);

  const ITEM_LIMIT = 10; // Set the item limit per page

  useEffect(() => {
    fetchItems();
  }, []);

  useEffect(() => {
    setFilteredItems(items);
  }, [items]);

  const fetchItems = async () => {
    setRefreshing(true);
    try {
      const response = await fetch(`${serverDest}/api/items`);
      const data = await response.json();
      setItems(data);
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
    setCurrentPage(0); // Reset to first page after sorting
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    const filtered = query.trim() === '' 
      ? items 
      : items.filter(item => item.name && item.name.toLowerCase().includes(query.toLowerCase()));
  
    setFilteredItems(filtered);
    setCurrentPage(0); // Reset to first page after search
  };
  

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemName}>{item.name}</Text>
      <Text style={styles.itemDescription}>{item.description}</Text>
    </View>
  );

  // Pagination Logic
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

// Styles
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
    backgroundColor: '#E7AD99', // A different color from the provided palette
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

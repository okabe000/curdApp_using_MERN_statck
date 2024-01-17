import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { serverDest } from '../config';
const ItemsScreen = ({ navigation }) => {
  const [items, setItems] = useState([]);
  const [sortAscending, setSortAscending] = useState(true);

  useEffect(() => {
  fetchItems();
  }, []);
  
  const fetchItems = async () => {
  try {
  // Replace with your API endpoint
  const response = await fetch(`${serverDest}/api/items`);
  const data = await response.json();
setItems(data);
} catch (error) {
console.error('Error fetching items:', error);
}
};

const sortItems = () => {
    const sortedItems = [...items].sort((a, b) => {
      const nameA = a.name || ''; // Fallback to empty string if undefined
      const nameB = b.name || ''; // Fallback to empty string if undefined
  
      if (sortAscending) {
        return nameA.localeCompare(nameB);
      }
      return nameB.localeCompare(nameA);
    });
  
    setItems(sortedItems);
    setSortAscending(!sortAscending); // Toggle the sorting order for next click
  };

const renderItem = ({ item }) => (
<View style={styles.itemContainer}>
<Text style={styles.itemName}>{item.name}</Text>
<Text style={styles.itemDescription}>{item.description}</Text>
{/* Other item details can be rendered here */}
</View>
);

return (
<View style={styles.container}>
<Text style={styles.title}>Items</Text>
<Button
title={sortAscending ? "Sort Descending" : "Sort Ascending"}
onPress={sortItems}
/>
<FlatList
data={items}
keyExtractor={item => item._id.toString()}
renderItem={renderItem}
/>
<Button
title="Add Item"
onPress={() => navigation.navigate('AddItemScreen')}
/>
</View>
);
};

const styles = StyleSheet.create({
container: {
flex: 1,
alignItems: 'center',
justifyContent: 'center',
padding: 10,
},
title: {
fontSize: 20,
marginBottom: 20,
},
itemContainer: {
padding: 10,
borderBottomWidth: 1,
borderBottomColor: '#ccc',
width: '100%',
},
itemName: {
fontSize: 16,
fontWeight: 'bold',
},
itemDescription: {
fontSize: 14,
color: '#666',
},
// Add other styles as needed
});

export default ItemsScreen;
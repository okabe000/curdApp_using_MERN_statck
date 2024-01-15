import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const ItemsScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Items</Text>
      {/* List items here with filter, search, sort functionalities */}
      {/* Button to navigate to AddItemScreen */}
      <Button
        title="Add Item"
        onPress={() => navigation.navigate('AddItemScreen')}
      />
    </View>
  );
};

// Similar styles as ProfileScreen
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
  },
});

export default ItemsScreen;

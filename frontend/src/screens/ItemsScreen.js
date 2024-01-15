import React from 'react';
import { View, Text, Button } from 'react-native';

const ItemsScreen = ({ navigation }) => {
  return (
    <View>
      <Text>ItemsScreen</Text>
      <Button
        title="Add Item"
        onPress={() => navigation.navigate('AddItemScreen')}
      />
    </View>
  );
};

export default ItemsScreen;

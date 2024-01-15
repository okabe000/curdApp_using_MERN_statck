import React from 'react';
import { View, Text, Button } from 'react-native';

const AddItemScreen = ({ navigation }) => {
  // Implement functionality to add a new item
  return (
    <View>
      <Text>AddItemScreen</Text>
      {/* Add form and functionality to add a new item */}
      <Button
        title="Preview Item"
        onPress={() => navigation.navigate('PreviewItemScreen')}
      />
    </View>
  );
};

export default AddItemScreen;

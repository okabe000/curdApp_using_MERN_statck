import React from 'react';
import { View, Text, Button } from 'react-native';

const PreviewItemScreen = ({ navigation }) => {
  // Implement functionality to preview an item
  return (
    <View>
      <Text>PreviewItemScreen</Text>
      {/* Display item preview */}
      <Button
        title="confirm"
        onPress={() => navigation.navigate('ItemsScreen')}
      />
    </View>
  );
};

export default PreviewItemScreen;

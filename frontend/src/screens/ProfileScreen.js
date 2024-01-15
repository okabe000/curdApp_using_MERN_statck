import React from 'react';
import { View, Text, Button } from 'react-native';

const ProfileScreen = ({ navigation }) => {
  return (
    <View>
      <Text>ProfileScreen</Text>
      {/* Conditionally render this button based on user role */}
      <Button
        title="Edit Item"
        onPress={() => navigation.navigate('EditItemScreen')}
      />
    </View>
  );
};

export default ProfileScreen;

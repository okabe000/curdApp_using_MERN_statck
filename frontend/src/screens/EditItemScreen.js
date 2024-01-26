import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';

const EditItemScreen = ({ route, navigation }) => {
  if (!route.params?.item) {
    // Handle the undefined case
    return <Text>Item not found</Text>;
    // Or navigate back
    // navigation.goBack();

  }

  const { item } = route.params;
  const [name, setName] = useState(item.name);
  const [description, setDescription] = useState(item.description);

const handleSubmit = async () => {
  try {
    const response = await fetch(`${serverDest}/api/users/${item.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, email /* include other fields as needed */ }),
    });

    if (!response.ok) {
      throw new Error('Failed to update user');
    }

    Alert.alert('Success', 'User updated successfully');
    navigation.goBack();
  } catch (error) {
    Alert.alert('Error', error.message);
  }
};


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Item</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
      />
      <Button
        title="Update Item"
        onPress={handleSubmit}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  // Same styles as in AddItemScreen
  // ...
});

export default EditItemScreen;

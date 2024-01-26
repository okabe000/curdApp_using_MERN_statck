import React, { useState } from 'react';
import { View, Text, Button, TextInput, StyleSheet, Alert} from 'react-native';
import { Picker } from '@react-native-picker/picker';

// If using React Native >= 0.63, use @react-native-picker/picker for Picker
import { serverDest } from '../config'; // Import your server destination

const AddItemScreen = ({ navigation, /* include user information if available */ }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('available');

  const handleSubmit = async () => {
    // Implement logic to get the owner's ID (logged-in user's ID)
    const ownerId = "12"; // Replace with actual logic to get owner's ID

    if (!name || !description) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    try {
      console.log({ name, description, owner: ownerId, status });

      const response = await fetch(`${serverDest}/api/items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, description }),
      });
    
      if (!response.ok) {
        throw new Error('Failed to create item');
    }
    
    Alert.alert('Success', 'Item added successfully');
    navigation.goBack(); // Navigate back or to another screen as needed
    } catch (error) {
    Alert.alert('Error', error.message);
    }
  }
  // Implement functionality to add a new item
  return (
    <View style={styles.container}>
<Text style={styles.title}>Add New Item</Text>
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
   title="Add Item"
   onPress={handleSubmit}
/>

    </View>
  );};
    

  const styles = StyleSheet.create({
    container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    },
    title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    },
    input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
    },
    picker: {
    width: '100%',
    marginBottom: 20,
    },
    // Add other styles as needed
    });

export default AddItemScreen;

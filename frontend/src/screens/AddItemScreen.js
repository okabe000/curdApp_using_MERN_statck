import React, { useState, useEffect, useContext } from 'react';
import { ScrollView, View, Text, Button, TextInput, StyleSheet, Alert, Image } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as ImagePicker from 'expo-image-picker';
import { serverDest } from '../config';
import { AuthContext } from '../context/AuthContext'; // Import AuthContext
import { Dimensions } from 'react-native';
const windowWidth = Dimensions.get('window').width;

const AddItemScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [location, setLocation] = useState(null);
  const [image, setImage] = useState(null);
  
  const { userId } = useContext(AuthContext); // Use useContext to get userId



  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissions required', 'Sorry, we need camera roll permissions to make this work!');
      }
    })();
  }, []);

    // New useEffect for tracking image state changes
    useEffect(() => {
      console.log('Image state updated to:', image);
    }, [image]);
  

  const handleSelectLocation = (e) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setLocation({ latitude, longitude });
  };

  const pickImage = async () => {
    console.log('pickImage: Starting image picking process...');
  
    try {
      console.log('pickImage: Requesting camera permission...');
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        console.warn('pickImage: Camera roll permission denied.');
        Alert.alert('Permissions required', 'Sorry, we need camera roll permissions to make this work!');
        return;
      }
  
      console.log('pickImage: Launching image library...');
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
  
      console.log('pickImage: Result from image library', result);
  
      if (!result.cancelled) {
        const selectedImage = result.assets[0].uri; // Access the URI from the assets array
        console.log('pickImage: Image selected', selectedImage);
        setImage(selectedImage); // Update the state with the selected image
      }
    } catch (error) {
      console.error('pickImage: Error during image picking process: ', error);
    }
  };
  
  
  const handleSubmit = async () => {
    console.log('Name:', name);
    console.log('Description:', description);
    console.log('Location:', location);
    console.log('Image:', image);
  
    if (!name || !description || !location || !image) {
      Alert.alert('Error', 'Please fill in all fields, select a location, and pick an image.');
      return;
    }
  
    const tagsArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag);
    const creationDate = new Date().toISOString();
  
    const itemData = {
      name,
      description,
      tags: tagsArray,
      location: {
        type: 'Point',
        coordinates: [location.longitude, location.latitude],
      },
      image,
      creationDate,
      providedBy: userId // Include the current user's ID as providedBy
    };
  
    try {
      const response = await fetch(`${serverDest}/api/items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(itemData),
      });
  
      if (!response.ok) {
        throw new Error('Failed to create item');
      }
  
      Alert.alert('Success', 'Item added successfully');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };
  

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        <Text style={styles.title}>Add New Item</Text>
        <TextInput style={styles.input} placeholder="Name" value={name} onChangeText={setName} />
        <TextInput style={styles.input} placeholder="Description" value={description} onChangeText={setDescription} />
        <TextInput style={styles.input} placeholder="Tags (comma separated)" value={tags} onChangeText={setTags} />

      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 24.7136, // Riyadh's latitude
          longitude: 46.6753, // Riyadh's longitude
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        onPress={handleSelectLocation}
        provider="google"
        apiKey="YOUR_GOOGLE_MAPS_API_KEY"
      >
        {location && <Marker coordinate={location} />}
      </MapView>
      <Button title={image ? "Change Image" : "Pick an Image"} onPress={pickImage} />
      {image && <Image source={{ uri: image }} style={styles.image} />}
      <Button title="Add Item" onPress={handleSubmit} />
      </View>
    </ScrollView>

  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: 'white', // Or any other background color
  },
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
  map: {
    width: '100%',
    height: 200,
    marginBottom: 20,
  },
  image: {
    width: windowWidth * 0.5, // 50% of the window's width
    height: windowWidth * 0.5, // 50% of the window's width, adjust the ratio as needed
    resizeMode: 'contain', // Ensures the entire image fits within the bounds
    alignSelf: 'center', // Centers the image in its container
    marginBottom: 20,
  },
});

export default AddItemScreen;

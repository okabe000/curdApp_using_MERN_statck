import React, { useState, useEffect, useContext } from 'react';
import { ScrollView, View, Text, Button, TextInput, StyleSheet,useColorScheme, Alert, Image, Dimensions,TouchableOpacity} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { serverDest } from '../config';
import { AuthContext } from '../context/AuthContext';
import Icon from 'react-native-vector-icons/Ionicons'; // Assuming you have Ionicons installed

import { themes } from '../utils/themesCenterlized';


const windowWidth = Dimensions.get('window').width;

const AddItemScreen = ({ navigation }) => {
  
const colorScheme = useColorScheme();
const theme = themes[colorScheme] || themes.light;
const styles = getStyles(theme);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [location, setLocation] = useState(null);
  const [image, setImage] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const { userId } = useContext(AuthContext);

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissions required', 'Sorry, we need camera roll permissions to make this work!');
      }
    })();
  }, []);

  const handleSelectLocation = (e) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setLocation({ latitude, longitude });
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!name || !description || !location || !image) {
      Alert.alert('Error', 'Please fill in all fields, select a location, and pick an image.');
      return;
    }
  
    const tagsArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag);
    const creationDate = new Date().toISOString();
  
    let formData = new FormData();
    formData.append('name', name);
    formData.append('userId', userId);
    formData.append('description', description);
    formData.append('tags', JSON.stringify(tagsArray));
    // Append location object parts separately
    formData.append('location[type]', 'Point');
    formData.append('location[coordinates][]', location.longitude);
    formData.append('location[coordinates][]', location.latitude);
    formData.append('creationDate', creationDate);
    formData.append('providedBy', userId);
    formData.append('image', {
      uri: image,
      type: 'image/jpeg',
      name: 'itemImage.jpg',
    });
  
    try {
      await axios.post(`${serverDest}/api/items`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: progressEvent => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        }
      });
  
      Alert.alert('Success', 'Item added successfully');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };
  

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{
          flexDirection: 'row',
          alignItems: 'left',
          padding: 10,
        }}>
        <Icon name="arrow-back" size={24} color={theme.colorsPalette.MainText} />
        <Text style={{ fontSize: 16, color: theme.colorsPalette.MainText, marginLeft: 5 }}>
          Back
        </Text>
      </TouchableOpacity>
        <Text style={styles.title}>Add New Item</Text>
        <TextInput style={styles.input} placeholder="Name" value={name} onChangeText={setName} />
        <TextInput style={styles.input} placeholder="Description" value={description} onChangeText={setDescription} />
        <TextInput style={styles.input} placeholder="Tags (comma separated)" value={tags} onChangeText={setTags} />

        <MapView
          style={styles.map}
          initialRegion={{
            latitude: 24.7136,
            longitude: 46.6753,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          onPress={handleSelectLocation}
        >
          {location && <Marker coordinate={location} />}
        </MapView>
        <Button title={image ? "Change Image" : "Pick an Image"} onPress={pickImage} />
        {image && <Image source={{ uri: image }} style={styles.image} />}
        
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBar, { width: `${uploadProgress}%` }]} />
        </View>
        <Text>{uploadProgress}%</Text>

        <Button title="Add Item" onPress={handleSubmit} />
      </View>
    </ScrollView>
  );
};
const getStyles = (theme) => StyleSheet.create({
  scrollView: {
    backgroundColor: '#FFF',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 20,
  },
  input: {
    width: '100%', // Ensure the input fields take the full width
    height: 40,
    borderColor: '#CCC',
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  map: {
    width: windowWidth - 40, // Subtracting the padding from the container
    height: 200, // Explicit height for the MapView
    marginBottom: 20,
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  progressBarContainer: {
    width: '100%',
    height: 20,
    backgroundColor: '#CCC',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#007BFF',
  },
  // Add other styles as needed
});

export default AddItemScreen;

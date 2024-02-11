import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, Image, Dimensions, ScrollView } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { serverDest, colorsPlate } from '../config'; // Import colorsPlate
import Icon from 'react-native-vector-icons/MaterialIcons'; // Assuming you're using MaterialIcons
const windowWidth = Dimensions.get('window').width;


const EditItemScreen = ({ route, navigation }) => {
  const item = route.params?.item || {}; // Ensure item is an object

  const [name, setName] = useState(item.name || '');
  const [description, setDescription] = useState(item.description || '');
  const [location, setLocation] = useState(item.location || null);

  const handleSubmit = async () => {
    try {
      const response = await fetch(`${serverDest}/api/items/${item._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, description }),
      });

      if (!response.ok) {
        throw new Error('Failed to update item');
      }

      Alert.alert('Success', 'Item updated successfully');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const handleSelectLocation = (e) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setLocation({ latitude, longitude });
  };

  const initialRegion = location
    ? {
        latitude: location.latitude || 24.7136,
        longitude: location.longitude || 46.6753,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }
    : {
        latitude: 24.7136,
        longitude: 46.6753,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      };

  return (<View>
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
    
    <ScrollView style={styles.scrollView}>
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

<MapView
  style={styles.map}
  initialRegion={initialRegion}
  onPress={handleSelectLocation}
>
  {location && (
    <Marker
      coordinate={{
        latitude: location.latitude || 24.7136,
        longitude: location.longitude || 46.6753,
      }}
    />
  )}
</MapView>


        <Button title="Update Item" onPress={handleSubmit} />
      </View>
    </ScrollView>
    </View>

  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: 'white',
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
  // ... Add other styles as needed
});

export default EditItemScreen;

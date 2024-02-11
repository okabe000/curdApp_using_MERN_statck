import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { encode as base64encode } from 'base-64';

const ItemCard = ({ item, theme, onPressEdit = null, onPressClaim = null, showClaimButton = false }) => {
  let distanceText = item.distance ? `${item.distance} km away` : 'Distance unavailable';
  const dynamicStyles = styles(theme);

  // Function to convert buffer to base64 string using base-64 library
  const bufferToBase64 = (buffer) => {
    if (!buffer) return null;
    const base64String = base64encode(buffer.reduce((acc, byte) => acc + String.fromCharCode(byte), ''));
    return `data:image/jpeg;base64,${base64String}`;
  };

  const renderImageOrPlaceholder = () => {
    // Determine if item.image is already a base64 string or a buffer that needs conversion
    const imageUri = item.image ? (typeof item.image === 'string' ? `data:image/jpeg;base64,${item.image}` : bufferToBase64(item.image.data)) : null;

    if (imageUri) {
      return <Image source={{ uri: imageUri }} style={dynamicStyles.image} />;
    } else {
      return <View style={dynamicStyles.noImageContainer}><Text style={dynamicStyles.noImageText}>No image</Text></View>;
    }
  };

  return (
    <View style={dynamicStyles.container}>
      {renderImageOrPlaceholder()}
      <View style={dynamicStyles.info}>
        <Text style={dynamicStyles.name}>{item.name}</Text>
        <Text style={dynamicStyles.description}>{item.description}</Text>
        <Text style={dynamicStyles.distance}>{distanceText}</Text>
        {showClaimButton && (
          <TouchableOpacity style={dynamicStyles.claimButton} onPress={onPressClaim}>
            <Text style={dynamicStyles.buttonText}>Request Claim</Text>
          </TouchableOpacity>
        )}
        {onPressEdit && (
          <TouchableOpacity style={dynamicStyles.editButton} onPress={onPressEdit}>
            <Icon name="edit" size={24} color={theme.colorsPalette.MainText} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = (theme) => StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginVertical: 8,
    backgroundColor: theme.colorsPalette.SecondaryBackground,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: theme.colorsPalette.navTabBG,
  },
  noImageContainer: {
    width: 80,
    height: 80,
    marginRight: 10,
    backgroundColor: 'darkred', // Background for "No image" placeholder
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5, // Optional: Adds rounded corners to the placeholder
  },
  noImageText: {
    color: 'white', // Text color for "No image"
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10, // Maintain this for spacing before the list starts
    marginTop: 20, // Add more space above this section if needed
    color: theme.colorsPalette.MainText,
  },
  image: {
    width: 100, // Example width
    height: '100%', // Example height
    resizeMode: 'contain', // Adjusts the image to fit within the component dimensions
  },
  
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colorsPalette.MainText,
  },
  description: {
    fontSize: 14,
    color: theme.colorsPalette.SecdText,
  },
  distance: {
    fontSize: 12,
    color: theme.colorsPalette.SecdText,
    marginTop: 5,
    fontWeight: 'bold',
  },
  claimButton: {
    marginTop: 10,
    backgroundColor: theme.colorsPalette.navTabActive,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  editButton: {
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default ItemCard;

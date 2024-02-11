import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  Alert,
  useColorScheme,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { serverDest } from '../config';
import { AuthContext } from '../context/AuthContext';
import { themes } from '../utils/themesCenterlized';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ItemCard from '../components/itemCard'; // Adjust the path as necessary

const ProfileScreen = ({ navigation }) => {
  const colorScheme = useColorScheme();
  const theme = themes[colorScheme] || themes.light;
  const styles = getStyles(theme);

  const [userItems, setUserItems] = useState([]);
  const [userScore, setUserScore] = useState(0);
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { userId, signOut } = useContext(AuthContext);

  useEffect(() => {
    if (userId) {
      loadUserProfile();
    } else {
      setIsLoading(false);
    }
  }, [userId]);


  const onRefresh = () => {
    loadUserProfile(); // Assuming this function reloads the data
  };

  const loadUserProfile = async () => {
    try {
      setRefreshing(true);
      const response = await fetch(`${serverDest}/api/users/${userId}/profile`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const profileData = await response.json();
  
      setUserScore(profileData.score);
      setUserItems(profileData.items);
      setUsername(profileData.username);
      console.log(`Image data structure for first item:`, profileData.items[0].image);

      // Log the presence of image data for each item
      profileData.items.forEach((item, index) => {
        console.log(`Item ${index + 1} (${item.name}): Image data present? ${item.image ? 'Yes' : 'No'}`);
      });
  
    } catch (error) {
      Alert.alert('Error', `Failed to fetch profile data: ${error.message}`);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };
  

  if (isLoading || !userId) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={theme.colorsPalette.MainText} />
      </View>
    );
  }


  // New layout: Profile info and a scrollable list of items
  return (
    <View style={styles.mainContainer}>
    <View style={styles.profileSection}>
      <Text style={styles.screenHeading}>User Profile</Text>
      <Text style={styles.profileText}>Welcome, {username}!</Text>
      <Text style={styles.profileInfo}>Score: {userScore}</Text>
    </View>
    <View style={styles.actionButtons}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('ChangeUserPasswordScreen')}>
        <Text style={styles.buttonText}>Change Password</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={signOut}>
        <Text style={styles.buttonText}>Sign Out</Text>
      </TouchableOpacity>
    </View>

    <Text style={styles.sectionTitle}>Your Items</Text>
    <TouchableOpacity style={styles.refreshButton} onPress={onRefresh}>
      <Icon name="refresh" size={24} color={theme.colorsPalette.MainText} />
    </TouchableOpacity>
    {userItems.length > 0 ? (
      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.itemsList}>
        {userItems.map((item) => (
          <ItemCard
            key={item.id}
            item={item}
            theme={theme}
            onPressEdit={() => navigation.navigate('EditItemScreen', { item })}
          />
        ))}
      </ScrollView>
    ) : (
      <Text style={styles.noItemsText}>No items found.</Text>
    )}
    </View>
  
  );
};

const getStyles = (theme) => StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: theme.colorsPalette.MainBackground,
    padding: 10, // Added padding for overall spacing
  },
  image: {
    width: 80, // or another appropriate width
    height: 80, // or another appropriate height
    marginRight: 10,
  },
  profileSection: {
    marginBottom: 20, // Spacing before the items list
  },
  screenHeading:{
    textAlign:'center',
    fontSize:30,
    color:'gray',
  },
  button: {
    ...theme.button, // Ensure this spreads all properties of theme.button
  },  profileText: {
    fontSize: 20, // Increased size for better visibility
    color: theme.colorsPalette.MainText,
    fontWeight: 'bold', // Make the welcome text stand out
  },
  profileInfo: {
    fontSize: 18,
    color: theme.colorsPalette.SecdText,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 30, // Spacing before the items list
    color: theme.colorsPalette.MainText,
  },
  scrollContainer: {
    flex: 1, // Allows the ScrollView to expand within the container
  },
  itemsList: {
    flexGrow: 1, // Ensures the container can grow within the scroll view
  },
  itemContainer: {
    padding: 10,
    marginVertical: 8,
    backgroundColor: theme.colorsPalette.SecondaryBackground,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: theme.colorsPalette.navTabBG,
    flexDirection: 'row', // Arrange children horizontally
  },
  itemText: {
    flex: 1, // Take up remaining space
    fontSize: 16,
    color: theme.colorsPalette.MainText,
  },
  editButtonContainer: {
    width: '20%', // Width of the button container
    justifyContent: 'center', // Center the button vertically
  },
  editButton: {
    ...theme.button,
    flex: 1, // Take up full height
    justifyContent: 'center', // Center text horizontally
    alignItems: 'center', // Center text vertically
  },
  
  // Rest of your styles...
});

export default ProfileScreen;

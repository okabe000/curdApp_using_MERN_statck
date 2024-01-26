import React, { useContext } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { AuthContext } from '../context/AuthContext'; // Adjust the path as necessary


const ProfileScreen = ({ navigation }) => {
  const { signOut } = useContext(AuthContext);
  const handleLogout = async () => {
    try {
      await signOut();
      Alert.alert("Logged Out", "You have been successfully logged out.");
    } catch (error) {
      Alert.alert("Logout Error", "An error occurred while trying to log out.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      {/* Display user information here */}
      {/* Button to navigate to EditItemScreen (conditionally rendered) */}
      <Button
        title="Edit Items"
        onPress={() => navigation.navigate('EditItemScreen')}
      />
            {/* Logout Button */}
      <Button
        title="Logout"
        onPress={handleLogout}
        color="red" // Optional styling
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
  },
});

export default ProfileScreen;

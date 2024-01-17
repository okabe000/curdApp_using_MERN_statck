import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { serverDest } from '../config'; // Adjust the path based on your file structure

const LeaderboardScreen = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Fetch the users and sort them by score
    fetchUsersAndSort();
  }, []);

  const fetchUsersAndSort = async () => {
    const url = `${serverDest}/api/users`; // Replace with your actual endpoint
    const httpMethod = 'GET';

    try {
        // Fetch users from your backend API using the correct endpoint and HTTP method
        const response = await fetch(url, { method: httpMethod });

        // Check if the response status code indicates success (e.g., 200 OK)
        if (!response.ok) {
            // If the response is not successful, throw an error with the custom message
            throw new Error(`Failed to fetch users. Server returned ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        // Sort users by score in descending order
        const sortedUsers = data.sort((a, b) => b.score - a.score);

        // Update the state with sorted users
        setUsers(sortedUsers);
    } catch (error) {
        // Log the error message explicitly
        console.error(`Error fetching and sorting users: ${error.message}`);

        // Handle different types of errors
        if (error instanceof TypeError && error.message === 'Network request failed') {
            console.error(`Network error. Please check your internet connection.`);
        }
    }
};





  const renderUserItem = ({ item }) => (
    <View style={styles.userItem}>
      <Text>{item.username}</Text>
      <Text>Score: {item.score}</Text>
      {/* Add other user information as needed */}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Leaderboard</Text>
      <FlatList
        data={users}
        keyExtractor={(item) => item._id} // Use a unique key for each user
        renderItem={renderUserItem}
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
  userItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});

export default LeaderboardScreen;

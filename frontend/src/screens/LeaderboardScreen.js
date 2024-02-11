import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, StatusBar,useColorScheme  } from 'react-native';
import { serverDest } from '../config'; // Adjust the path based on your file structure
import {themes } from '../utils/themesCenterlized'

const LeaderboardScreen = () => {

  const colorScheme = useColorScheme(); // 'light' or 'dark'
  const theme = themes[colorScheme] || themes.light; // Fallback to light theme if undefined
  const styles = getStyles(theme); // Dynamically create styles based on the theme

  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsersAndSort();
  }, []);

  const fetchUsersAndSort = async () => {
    try {
      const response = await fetch(`${serverDest}/api/users`); // Replace '/users' with your API endpoint
      const data = await response.json();

      if (response.ok) {
        const sortedUsers = data.sort((a, b) => b.score - a.score); // Assuming each user object has a 'score' field
        setUsers(sortedUsers);
      } else {
        // Handle the case where the server responds with an error
        console.error('Server responded with an error:', data.message);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };
  const renderUserItem = ({ item, index }) => (
    <View style={styles.userItem}>
      <Text style={styles.rank}>{index + 1}</Text>
      <Text style={styles.username}>{item.username}</Text>
      <Text style={styles.score}>Score: {item.score}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Text style={styles.title}>Leaderboard</Text>
      <FlatList
        data={users}
        keyExtractor={(item) => item._id}
        renderItem={renderUserItem}
      />
    </View>
  );
};

const getStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colorsPalette.MainBackground,
    paddingTop: StatusBar.currentHeight || 0,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colorsPalette.SecondaryBackground,
    marginHorizontal: 10,
    marginVertical: 5,
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  rank: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colorsPalette.SecdText,
    marginRight: 10,
  },
  username: {
    flex: 1,
    fontSize: 16,
    color: theme.colorsPalette.MainText,
  },
  score: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#eb5757',
  },
});

export default LeaderboardScreen;

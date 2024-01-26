import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, StatusBar } from 'react-native';
import { serverDest } from '../config'; // Adjust the path based on your file structure

const LeaderboardScreen = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsersAndSort();
  }, []);

  const fetchUsersAndSort = async () => {
    // ... your existing fetch logic
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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
    backgroundColor: 'white',
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
    color: '#4a90e2',
    marginRight: 10,
  },
  username: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  score: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#eb5757',
  },
});

export default LeaderboardScreen;

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const LeaderboardScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Leaderboard</Text>
      {/* Leaderboard list implementation goes here */}
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

export default LeaderboardScreen;

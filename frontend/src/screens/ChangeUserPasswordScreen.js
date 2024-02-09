import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { serverDest } from '../config';

const ChangeUserPasswordScreen = ({ navigation }) => {
    const { userId } = useContext(AuthContext);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');

    const handleChangePassword = async () => {
        // Assuming you have the user's token stored in AsyncStorage
        const token = await AsyncStorage.getItem('userToken');
        if (!token) {
            Alert.alert("Error", "You must be logged in to change your password.");
            return;
        }

        console.log('Attempting to change password for user ID:', userId);

        const url = `${serverDest}/api/users/${userId}/password`; // Update this URL to match your API
        const requestOptions = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ currentPassword, newPassword ,userId }),
        };

        try {
            const response = await fetch(url, requestOptions);
            const result = await response.json();

            if (response.ok) {
                Alert.alert("Success", "Password changed successfully.");
                navigation.goBack(); // Navigate back to the previous screen
            } else {
                Alert.alert("Error", result.message || "An error occurred while changing the password.");
            }
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "An error occurred while changing the password.");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Current Password:</Text>
            <TextInput
                secureTextEntry
                style={styles.input}
                value={currentPassword}
                onChangeText={setCurrentPassword}
            />
            <Text style={styles.label}>New Password:</Text>
            <TextInput
                secureTextEntry
                style={styles.input}
                value={newPassword}
                onChangeText={setNewPassword}
            />
            <Button title="Change Password" onPress={handleChangePassword} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
    },
    input: {
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#ccc',
        marginBottom: 15,
        padding: 10,
        borderRadius: 5,
    },
});

export default ChangeUserPasswordScreen;

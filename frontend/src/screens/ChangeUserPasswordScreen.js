import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, useColorScheme } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { serverDest } from '../config';
import { themes } from '../utils/themesCenterlized';
import Icon from 'react-native-vector-icons/Ionicons'; // Assuming you have Ionicons installed

const ChangeUserPasswordScreen = ({ navigation }) => {
    const colorScheme = useColorScheme();
    const theme = themes[colorScheme] || themes.light;
    const styles = getStyles(theme);

    const { userId } = useContext(AuthContext);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');

    const handleChangePassword = async () => {
        const token = await AsyncStorage.getItem('userToken');
        if (!token) {
            Alert.alert("Error", "You must be logged in to change your password.");
            return;
        }

        const url = `${serverDest}/api/users/${userId}/password`;
        const requestOptions = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ currentPassword, newPassword, userId }),
        };

        try {
            const response = await fetch(url, requestOptions);
            const result = await response.json();

            if (response.ok) {
                Alert.alert("Success", "Password changed successfully.");
                navigation.goBack();
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
            <TouchableOpacity style={styles.button} onPress={handleChangePassword}>
                <Text style={styles.buttonText}>Change Password</Text>
            </TouchableOpacity>

        </View>
    );
};

const getStyles = (theme) => StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: theme.colorsPalette.MainBackground,
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
        color: theme.colorsPalette.MainText,
    },
    input: {
        fontSize: 16,
        borderWidth: 1,
        borderColor: theme.colorsPalette.SecondaryBackground,
        marginBottom: 15,
        padding: 10,
        borderRadius: 5,
        color: theme.colorsPalette.MainText,
        backgroundColor: theme.colorsPalette.SecondaryBackground,
    },
    button: {
        ...theme.button,
        backgroundColor: theme.colorsPalette.MainBackground, // Use button background color from theme
        marginTop: 10,
    },
    buttonText: {
        ...theme.buttonText,
        color: theme.colorsPalette.SecdText, // Use button text color from theme
    }
});

export default ChangeUserPasswordScreen;

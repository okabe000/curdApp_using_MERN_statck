import React, { useState } from 'react';
import { View, TextInput, Button, Alert, AsyncStorage } from 'react-native';
import { serverDest } from '../config';
const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        try {
            // API call to backend for authentication
            const response = await fetch(`${serverDest}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Login failed');

            // Store JWT token
            await AsyncStorage.setItem('userToken', data.token);

            // Update app state or navigate to protected screen
            // ...
        } catch (error) {
            Alert.alert('Login Error', error.message);
        }
    };

    return (
        <View>
            <TextInput placeholder="Email" value={email} onChangeText={setEmail} />
            <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
            <Button title="Log In" onPress={handleLogin} />
        </View>
    );
};

export default LoginScreen;

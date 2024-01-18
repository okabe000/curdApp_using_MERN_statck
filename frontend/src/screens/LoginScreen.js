import React, { useState, useContext } from 'react';
import { View, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { AuthContext } from '../context/AuthContext'; // Adjust the path as necessary
import { serverDest } from '../config'; // Your server destination

const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { signIn } = useContext(AuthContext);

    const handleLogin = async () => {
        try {
            const response = await fetch(`${serverDest}/api/users/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });
            const data = await response.json();
    
            if (!response.ok) {
                // Handle non-OK responses (like 400 or 500 errors)
                throw new Error(data.message || 'Login failed due to an unknown error');
            }
    
            signIn(data.token);
            // Optionally navigate to the main app screen after login
        } catch (error) {
            Alert.alert('Login Error', error.message || 'An error occurred during login');
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <Button title="Log In" onPress={handleLogin} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    input: {
        width: '80%',
        padding: 10,
        borderWidth: 1,
        borderColor: 'gray',
        marginBottom: 15,
    },
});

export default LoginScreen;

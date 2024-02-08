import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, Alert, TouchableOpacity, StyleSheet } from 'react-native';
import { AuthContext } from '../context/AuthContext'; // Adjust the path as necessary
import { serverDest } from '../config'; // Your server destination

const RegistrationScreen = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [userCategory, setUserCategory] = useState('provider'); // Default to 'provider'
    const { signIn } = useContext(AuthContext);

    const handleRegister = async () => {
        try {
            const response = await fetch(`${serverDest}/api/users`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email, password, category: userCategory }),
            });
            const data = await response.json();
    
            if (!response.ok) {
                throw new Error(data.message || 'Registration failed due to an unknown error');
            }
    
            signIn(data.token);
        } catch (error) {
            Alert.alert('Registration Error', error.message || 'An error occurred during registration');
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
            />
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
            <View style={styles.radioContainer}>
                <Text>User Category:</Text>
                <View style={styles.radioGroup}>
                    <TouchableOpacity
                        style={styles.radioButton}
                        onPress={() => setUserCategory('provider')}>
                        <Text style={styles.radioText}>Provider</Text>
                        {userCategory === 'provider' && <View style={styles.radioDot} />}
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.radioButton}
                        onPress={() => setUserCategory('claimer')}>
                        <Text style={styles.radioText}>Claimer</Text>
                        {userCategory === 'claimer' && <View style={styles.radioDot} />}
                    </TouchableOpacity>
                </View>
            </View>
            <Button title="Register" onPress={handleRegister} />
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
    radioContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    radioGroup: {
        flexDirection: 'row',
        marginLeft: 10,
    },
    radioButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 20,
    },
    radioText: {
        marginRight: 5,
    },
    radioDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: 'blue',
    },
});

export default RegistrationScreen;

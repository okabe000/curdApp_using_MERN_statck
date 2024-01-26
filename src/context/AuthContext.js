import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [userToken, setUserToken] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check token on app start
        const bootstrapAsync = async () => {
            let token;
            try {
                token = await AsyncStorage.getItem('userToken');
            } catch (e) {
                console.error('Restoring token failed', e);
            }
            setUserToken(token);
            setIsLoading(false);
        };

        bootstrapAsync();
    }, []);

    const signIn = async (token) => {
        setUserToken(token);
        await AsyncStorage.setItem('userToken', token);

    };

    const signOut = async () => {
        setUserToken(null);
        await AsyncStorage.removeItem('userToken');
        setUserToken(null); // Make sure to update the user token state

    };

    return (
        <AuthContext.Provider value={{ userToken, isLoading, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    );
};

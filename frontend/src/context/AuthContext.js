import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { decode as atob } from 'base-64';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const { theme } = useContext(ThemeContext); // Access the theme

    const [userToken, setUserToken] = useState(null);
    const [userId, setUserId] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const decodeJWT = (token) => {
        if (!token || token.split('.').length !== 3) {
            console.error('Invalid JWT token');
            return null;
        }

        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));

            const decoded = JSON.parse(jsonPayload);
            console.log("Decoded JWT:", decoded);
            // Use the same key as used in the JWT payload
            setUserId(decoded.userId);
            return decoded;
        } catch (error) {
            console.error('Error decoding token:', error);
            return null;
        }
    };

    useEffect(() => {
        const bootstrapAsync = async () => {
            let token;
            try {
                token = await AsyncStorage.getItem('userToken');
                if (token) {
                    const decoded = decodeJWT(token);
                    if (decoded && decoded.userId) {
                        setUserId(decoded.userId);
                    }
                }
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
        const decoded = decodeJWT(token);
        if (decoded && decoded.userId) {
            setUserId(decoded.userId);
        }
    };

    const signOut = async () => {
        setUserToken(null);
        setUserId(null);
        await AsyncStorage.removeItem('userToken');
    };

    return (
        <AuthContext.Provider value={{ userToken, userId, isLoading, signIn, signOut,theme }}>
            {children}
        </AuthContext.Provider>
    );
};

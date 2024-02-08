import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { decode as atob } from 'base-64';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [userToken, setUserToken] = useState(null);
    const [userId, setUserId] = useState(null);
    const [userCategory, setUserCategory] = useState(null); // Added userCategory state
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
            // Assuming the user category is part of the JWT payload
            setUserId(decoded.userId);
            setUserCategory(decoded.category); // Set user category from the decoded token
            console.log(userCategory)
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
                    if (decoded) {
                        // Set both userId and userCategory from the token
                        setUserId(decoded.userId);
                        setUserCategory(decoded.category);
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
        if (decoded) {
            // Set both userId and userCategory upon signing in
            setUserId(decoded.userId);
            setUserCategory(decoded.category);
        }
    };

    const signOut = async () => {
        setUserToken(null);
        setUserId(null);
        setUserCategory(null); // Clear user category on sign out
        await AsyncStorage.removeItem('userToken');
    };

    // Include userCategory in the context value provided to consumers
    return (
        <AuthContext.Provider value={{ userToken, userId, userCategory, isLoading, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    );
};

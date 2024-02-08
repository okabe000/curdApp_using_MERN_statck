import React from 'react';
import { TouchableOpacity, Text, TextInput, Alert, StyleSheet } from 'react-native';

// Custom Button
export const CustomButton = ({ onPress, title, style, textStyle, ...props }) => {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.button, style]} {...props}>
      <Text style={[styles.text, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

// Custom Input
export const CustomInput = ({ style, ...props }) => {
  return (
    <TextInput style={[styles.input, style]} {...props} />
  );
};

// Custom Alert
export const CustomAlert = (title, message, buttons, options) => {
  Alert.alert(title, message, buttons, options);
};

// Custom Text
export const CustomText = ({ children, style, ...props }) => {
    return (
      <Text style={[styles.text, style]} {...props}>
        {children}
      </Text>
    );
  };
  
// Styles
const styles = StyleSheet.create({
  button: {
    padding: 10,
    margin: 10,
    borderRadius: 5,
    alignItems: 'center',
    backgroundColor: '#007bff',
  },
  text: {
    fontSize: 16,
    color: '#333', // Default text color
    // Add other default styles as needed
  },
  input: {
    borderWidth: 1,
    borderColor: '#777',
    padding: 8,
    margin: 10,
    width: 200,
  },
});


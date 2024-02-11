export const themes = {
 
  light: {
    colorsPalette: {
      MainBackground: '#F0F0F0', // Light grey for a neutral, less vibrant background
      SecondaryBackground: '#D6E4FF', // Soft blue for secondary elements, offering a calm contrast
      MainText: '#333333', // Dark grey for main text to ensure readability
      SecdText: '#595959', // Slightly lighter grey for secondary text, maintaining contrast
      navTabActive: '#4B9FEA', // Bright blue for active navigation tabs for better visibility
      navTabInActive: '#AAB4BE', // Muted blue for inactive navigation tabs, less attention-grabbing
      navTabBG: '#E3F2FD', // Very light blue for navigation tab background, soft and non-intrusive
    },
    button: {
      background:'#E11FFF',
      borderRadius: 100,
      paddingVertical: 20,
      paddingHorizontal: 24,
      shadowColor: '#000000', // Changed to black for a more subtle shadow effect
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    buttonText: {
      fontSize: 16,
      color: '#FFFFFF', // Changed to white for better contrast on colored buttons
      fontWeight: 'bold',
      textAlign: 'center',
    },

    flatListItem: {
      backgroundColor: '#FFFFFF', // Pure white for list items, offering a clean look
      padding: 10,
      marginVertical: 8,
      borderRadius: 5,
      borderColor: '#E0E0E0', // Lighter grey for borders, subtle
      borderWidth: 1,
    },
    flatListItemText: {
      color: '#4A4A4A', // Darker grey for list item texts, ensuring readability
      fontSize: 16,
    },
    input: {
      placeholderTextColor: '#9E9E9E', // Medium grey for placeholder text, visible yet unobtrusive
    },
  },
  /*

   colorsPalette: {
    MainBackground: '#282828', // Assuming a dark main background
    SecondaryBackground: '#8E9AAF', // Cadet Blue for secondary elements like cards
    HighlightBackground: '#DEE2FF', // Periwinkle for highlights and active states
    MainText: '#FEEAFA', // Misty Rose for primary text for better readability
    SecondaryText: '#EFD3D7', // Pale Pink for secondary text
    Accent: '#CBC0D3', // Thistle for accents and interactive elements like icons
    ButtonBackground: '#8E9AAF', // Cadet Blue for button backgrounds
    ButtonText: '#282828', // Dark for text on light button background
    InputBackground: '#CBC0D3', // Thistle for input fields background
    InputText: '#282828', // Dark for text in input fields for readability
    CardBackground: '#8E9AAF', // Cadet Blue for cards or modal backgrounds
    BorderColor: '#DEE2FF', // Periwinkle for borders and dividers
  },
  button: {
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#8E9AAF', // Cadet Blue
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  buttonText: {
    fontSize: 16,
    color: '#FEEAFA', // Misty Rose for contrast
    fontWeight: 'bold',
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#CBC0D3', // Thistle
    color: '#282828', // Dark for text
    borderRadius: 5,
    padding: 10,
  },
  card: {
    backgroundColor: '#8E9AAF', // Cadet Blue
    borderRadius: 8,
    padding: 15,
    marginVertical: 10,
  },
  text: {
    main: {
      fontSize: 18,
      color: '#FEEAFA', // Misty Rose for primary text
      fontWeight: 'normal',
    },
    secondary: {
      fontSize: 16,
      color: '#EFD3D7', // Pale Pink for secondary text
      fontWeight: 'normal',
    },
    highlight: {
      fontSize: 16,
      color: '#DEE2FF', // Periwinkle for highlighted text
      fontWeight: 'bold',
    },
  },

  light: {
    colorsPalette: {
      MainBackground: '#F0F0F0', // Light grey for a neutral, less vibrant background
      SecondaryBackground: '#D6E4FF', // Soft blue for secondary elements, offering a calm contrast
      MainText: '#333333', // Dark grey for main text to ensure readability
      SecdText: '#595959', // Slightly lighter grey for secondary text, maintaining contrast
      navTabActive: '#4B9FEA', // Bright blue for active navigation tabs for better visibility
      navTabInActive: '#AAB4BE', // Muted blue for inactive navigation tabs, less attention-grabbing
      navTabBG: '#E3F2FD', // Very light blue for navigation tab background, soft and non-intrusive
    },
    button: {
      borderRadius: 100,
      paddingVertical: 20,
      paddingHorizontal: 24,
      shadowColor: '#000000', // Changed to black for a more subtle shadow effect
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    buttonText: {
      fontSize: 16,
      color: '#FFFFFF', // Changed to white for better contrast on colored buttons
      fontWeight: 'bold',
      textAlign: 'center',
    },

    flatListItem: {
      backgroundColor: '#FFFFFF', // Pure white for list items, offering a clean look
      padding: 10,
      marginVertical: 8,
      borderRadius: 5,
      borderColor: '#E0E0E0', // Lighter grey for borders, subtle
      borderWidth: 1,
    },
    flatListItemText: {
      color: '#4A4A4A', // Darker grey for list item texts, ensuring readability
      fontSize: 16,
    },
    input: {
      placeholderTextColor: '#9E9E9E', // Medium grey for placeholder text, visible yet unobtrusive
    },
  },
  */
  
  dark: {
    background: '#000000',
    text: '#FFFFFF',
    // Define dark theme button styles similarly, including buttonTextColor
    buttonTextColor: {
      default: '#FFFFFF',
      secondary: '#00FF00', // Example secondary color for dark theme
      // Add more variations as needed
    },

    flatListItem: {
      backgroundColor: '#333333', // Dark theme background for list items
      padding: 10,
      marginVertical: 8,
      borderRadius: 5,
      borderColor: '#444444',
      borderWidth: 1,
    },
    flatListItemText: {
      color: '#FFFFFF', // Text color for dark theme
      fontSize: 16,
    },
    input: {
      // Previous input styles...
      placeholderTextColor: '#AAAAAA', // Dark theme placeholder text color
    },
    // Additional styles as before
  }
};


export const colorPalettes = {
  SolarizedLight: {
    MainBackground: '#FDF6E3',
    SecondaryBackground: '#EEE8D5',
    MainText: '#657B83',
    SecdText: '#586E75',
    ButtonBackground: '#859900',
    ButtonText: '#FDF6E3',
    navTabActive: '#268BD2',
    navTabInActive: '#93A1A1',
    navTabBG: '#EEE8D5',
  },
  SolarizedDark: {
    MainBackground: '#002B36',
    SecondaryBackground: '#073642',
    MainText: '#839496',
    SecdText: '#93A1A1',
    ButtonBackground: '#859900',
    ButtonText: '#002B36',
    navTabActive: '#268BD2',
    navTabInActive: '#657B83',
    navTabBG: '#073642',
  },
  Nord: {
    MainBackground: '#2E3440',
    SecondaryBackground: '#3B4252',
    MainText: '#D8DEE9',
    SecdText: '#E5E9F0',
    ButtonBackground: '#5E81AC',
    ButtonText: '#ECEFF4',
    navTabActive: '#88C0D0',
    navTabInActive: '#4C566A',
    navTabBG: '#3B4252',
  },
  Material: {
    MainBackground: '#FFFFFF',
    SecondaryBackground: '#F5F5F5',
    MainText: '#212121',
    SecdText: '#757575',
    ButtonBackground: '#E0E0E0',
    ButtonText: '#212121',
    navTabActive: '#FFC107',
    navTabInActive: '#BDBDBD',
    navTabBG: '#F5F5F5',
  },
};

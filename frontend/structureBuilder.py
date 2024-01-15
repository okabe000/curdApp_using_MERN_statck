import os

# Adjusted function to create directory structure without overwriting certain files
def create_directory_structure(base_path, structure):
    for name, content in structure.items():
        path = os.path.join(base_path, name)
        if isinstance(content, dict):
            os.makedirs(path, exist_ok=True)
            create_directory_structure(path, content)
        elif content is not None:
            with open(path, 'a') as f:
                f.write(content)

# Adjusted React Native Frontend App Structure (excluding package.json and babel.config.js)
frontend_structure = {
    'App.js': '',
    'src': {
        'screens': {
            'ProfileScreen.js': '',
            'EditItemScreen.js': '',
            'ItemsScreen.js': '',
            'AddItemScreen.js': '',
            'PreviewItemScreen.js': '',
            'LeaderboardScreen.js': ''
        },
        'navigation': {
            'AppNavigator.js': ''  # This will contain the combined navigation logic
        },
        'components': {},
        'assets': {
            'images': {},
            'fonts': {}
        },
        'constants': {
            'Colors.js': '',
            'Styles.js': ''
        },
        'redux': {
            'store.js': '',
            'reducers': {},
            'actions': {}
        },
        'utils': {
            'api.js': ''  # For API calls
        }
    }
}

# Define the root directory for the frontend app
root_directory = 'Z:\\MICS\\Projects___IN_PROGRESS\\DevPorj\\ReactNative\\GPapp\\CURDPlatform\\curdapp_v003\\frontend'

# Create the project structure
create_directory_structure(root_directory, frontend_structure)

root_directory


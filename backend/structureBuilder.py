import os

# Directory structure to create
project_structure = {
    'Root Directory': {
        'src': {
            'api': {
                'controllers': {},
                'routes': {}
            },
            'models': {
                'user.js': '',
                'item.js': ''
            },
            'config': {
                'db.js': ''
            },
            'middleware': {
                'auth.js': ''
            },
            'services': {},
            'utils': {}
        },
        'test': {
            'unit': {},
            'integration': {}
        },
        'public': {},  # Optional
        'docs': {},    # Optional
        'app.js': '',
        'package.json': '',
        '.env': '',
        '.gitignore': ''
    }
}

def create_directory_structure(base_path, structure):
    for name, content in structure.items():
        path = os.path.join(base_path, name)
        if isinstance(content, dict):
            os.makedirs(path, exist_ok=True)
            create_directory_structure(path, content)
        else:
            open(path, 'a').close()  # Create an empty file

# Create the project structure in a specified root directory
root_directory = 'Z:\\MICS\\Projects___IN_PROGRESS\\DevPorj\\ReactNative\\GPapp\\CURDPlatform\\curdapp_v003\\backend'


create_directory_structure(root_directory, project_structure['Root Directory'])

root_directory


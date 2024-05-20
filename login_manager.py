import json
import os.path

import bcrypt  # Developed in V4.1.2

import dateTimeHandler


# Fuction to hash a password
def hash_password(password):
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())


# Function to check a password
def check_password(input_password, hashed_password):
    return bcrypt.checkpw(input_password.encode('utf-8'), bytes(hashed_password, 'utf-8'))


# Function to check a user
def check_user(username, password):
    users_data = get_users_data()
    if username in users_data:
        return check_password(password, users_data[username]['password'])
    else:
        return False


# Function to read the user_data.json file
def get_users_data():
    try:
        with open('user_data.json', 'r') as file:
            return json.load(file)
    except FileNotFoundError:
        return {}


def get_number_users():
    try:
        with open('user_data.json', 'r') as file:
            return json.load(file)['sysInfo']['number_users']
    except FileNotFoundError:
        return -1


# Function to write the user_data.json file
def write_users_data(data):
    with open('user_data.json', 'w') as file:
        json.dump(data, file)


# Function to register a user
def register_user(name, username, email, password):
    users_data = get_users_data()
    if username in users_data:
        return False, 'Benutzername bereits vergeben.'
    else:
        hashed_password = hash_password(password)
        now = str(dateTimeHandler.getCurrentTime())
        user_id = '0x{:08X}'.format(get_number_users() & 0xFFFFFFFF)
        users_data[username] = {'id': user_id,
                                'password': hashed_password.decode('utf-8'),
                                'name': name,
                                'email': email,
                                'role': 'user',
                                'status': 'active',
                                'created_at': now, 'updated_at': now}
        users_data['sysInfo']['number_users'] += 1
        write_users_data(users_data)
        create_user_folder(user_id)
        return True, 'Benutzer erfolgreich registriert.'


# Function returns the role of a user
def get_role(username):
    users_data = get_users_data()
    if username in users_data:
        return users_data[username]['role']
    else:
        return 'unknown'


def get_id(username):
    user_data = get_users_data()
    if username in user_data:
        return user_data[username]['id']
    else:
        return 'unknown'


def create_user_folder(user_id):
    destination_folder = './user_files/'
    if not os.path.exists(destination_folder + user_id):
        os.makedirs(destination_folder + user_id)

        json_file_path = os.path.join(destination_folder + user_id, user_id + '.json')

        with open(json_file_path, 'w') as json_file:
            json.dump([{"title": "Welcome", "document_type": ".txt",
                        "content": "Welcome to YNotes!\nThis is your personal note space.\n\nThis is a welcome note. Feel free to write more if you like. Here are a few tips to get you started:\n\n - Create New Notes: Click 'New Note' to start a fresh note. Remember to save your work frequently.\n\n - Organize Your Thoughts: Use different file formats for different types of content. You can change the file extension when saving.\n\n - Keep Your Data Secure: Although YNotes is not designed for high security, dont save any password here.\n\n - Manage Your Files: Use the 'Download' and 'Delete' options to keep your notes organized and clutter-free.",
                        "date": "20.5.2024, 17:26:29"}], json_file)

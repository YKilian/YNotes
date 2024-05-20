import json

from flask import Flask, render_template, request, redirect, url_for, send_from_directory, jsonify, make_response
from flask_socketio import SocketIO

from login_manager import check_user, register_user, get_role, get_id

app = Flask(__name__)
socketio = SocketIO(app)


@app.route('/')
def index():
    try:
        username = request.cookies.get('username')
        password = request.cookies.get('password')
        if check_user(username, password):
            return redirect(url_for(get_role(username), username=username))
        else:
            return render_template('login.html')
    except:
        return render_template('login.html')


@app.route('/createAccount')
def createAccount():
    return render_template('register.html')


@socketio.on('message')
def handle_message(message):
    print('Received message:', message)
    socketio.send('Echo: ' + message)


@app.route('/logout')
def logout():
    response = make_response(redirect(url_for('index')))
    response.set_cookie('username', '', expires=0)
    response.set_cookie('password', '', expires=0)
    return response


@app.route('/login', methods=['POST'])
def login():
    username = request.form['username']
    password = request.form['password']

    if check_user(username, password):
        # Set cookies
        response = make_response(redirect(url_for(get_role(username), username=username)))
        response.set_cookie('username', username)
        response.set_cookie('password', password)
        return response
    else:
        return render_template('login.html', message='Wrong username or password', username=username)


@app.route('/register', methods=['POST'])
def register():
    name = request.form['name']
    username = request.form['username']
    email = request.form['email']
    password = request.form['password']

    success, message = register_user(name, username, email, password)
    if success:
        response = make_response(redirect(url_for(get_role(username), username=username)))
        response.set_cookie('username', username)
        response.set_cookie('password', password)
        return response
    else:
        return render_template('register.html', message=message)


@app.route('/user/<username>')
def user(username):
    c_username = request.cookies.get('username')
    c_password = request.cookies.get('password')
    if check_user(c_username, c_password) and c_username == username:
        id = get_id(username)
        file_path = f'./user_files/{id}/{id}.json'
        try:
            with open(file_path, 'r') as file:
                json_file = json.load(file)
                json_string = json.dumps(json_file)  # Serialize JSON data
                return render_template('user.html', file=json_string, username=c_username)
        except FileNotFoundError:
            return -1
    else:
        return render_template('login.html', message='You are not logged in to this account.', username=username)


@app.route('/admin/<username>')
def admin(username):
    return f'Welcome, {username}!'


@app.route('/static/<path:path>')
def send_static(path):
    return send_from_directory('static', path)


@app.route('/save_file', methods=['POST'])
def save_file():
    data = request.json

    username = request.cookies.get('username')
    password = request.cookies.get('password')

    if username is None or password is None:
        return jsonify({'error': 'Username or password not provided'}), 400

    id = get_id(username)

    if not check_user(username, password):
        return jsonify({'error': 'Invalid credentials'}), 401

    file_path = f'./user_files/{id}/{id}.json'

    try:
        with open(file_path, 'w') as file:
            json.dump(data, file)
        return jsonify({'success': True})
    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=5000, debug=True, allow_unsafe_werkzeug=True)

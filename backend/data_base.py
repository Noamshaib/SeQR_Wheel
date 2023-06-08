import sqlite3
import hashlib
import re
from flask import Flask, request, jsonify

app = Flask(__name__)
database_user_password = 'users_pass_email.db'

max_user_len = 15
min_user_len = 5
max_password_len = 18
min_password_len = 7

#cursor.execute('''CREATE TABLE IF NOT EXISTS users
     #             (id INTEGER PRIMARY KEY AUTOINCREMENT, 
      #            username TEXT(200) NOT NULL, 
        #          password TEXT NOT NULL,
       #           email TEXT NOT NULL)''')


def encrypt_password(password):
    # Encrypt the password using a hash function (SHA-256)
    hashed_password = hashlib.sha256(password.encode()).hexdigest()
    return hashed_password

def valid_user_or_password(user, password):
    if user == None or password == None:
        return False
    
    user_len = len(user)
    password_len = len(password)

    if min_user_len > user_len and user_len > max_user_len:
        return False

    if min_password_len > password_len and password_len > max_password_len:
        return False

    if not (user.isalnum() and password.isalnum()):
        return False

    return True

def verify_email_format(email):
    regex = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,7}\b'
    return (re.fullmatch(regex, email))
    
def illegal_input_err():
    return jsonify({'message':'Illeagal input'}), 400

def exist_user_or_email(username, email):
    conn = get_db_connection_for_user_password()
    cursor = conn.cursor()

    # Check if the username exists
    cursor.execute("SELECT * FROM users WHERE username = ?", (username,))#table called users
    existing_user = cursor.fetchone()

    # Check if the email exists
    cursor.execute("SELECT * FROM users WHERE email = ?", (email,))#table called users
    existing_email = cursor.fetchone()

    conn.close()

    if existing_user:
        return "Username already exists"
    elif existing_email:
        return "Email already exists"
    else:
        return None #means username or email already taken


# Helper function to establish a database connection
def get_db_connection_for_user_password():
    conn = sqlite3.connect(database_user_password)
    conn.row_factory = sqlite3.Row
    return conn

# Example route to create a new user
@app.route('sign_up', methods=['POST'])
def create_user():
    #add another database saperated from user - password to the all other data
    #if there is time make the password with hash
    data = request.json
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    if not valid_user_or_password(username, password) or not verify_email_format(email):
        return illegal_input_err()
        
    msg = exist_user_or_email(username, email)
    if msg != None:
        return jsonify({'message': msg}), 400
    
    
    # Create a new user
    conn_user_pass = get_db_connection_for_user_password()
    cursor_user_pass = conn_user_pass.cursor()
    hashed_password = encrypt_password(password)
    cursor_user_pass.execute("INSERT INTO users (username, password, email) VALUES (?, ?, ?)", (username, hashed_password, email))
    conn_user_pass.commit()
    conn_user_pass.close()

    return jsonify({'message': 'User created successfully'}), 200

# Example route to get all users
@app.route('login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    
    if(valid_user_or_password(username,password) == False):
        illegal_input_err()

    conn = get_db_connection_for_user_password()
    # Create a cursor object to execute SQL queries
    cursor = conn.cursor()

    # Execute the SELECT query to retrieve the user by username
    cursor.execute("SELECT * FROM users WHERE username = ?", (username,))

    # Fetch the first row (user) from the result set
    user = cursor.fetchone()

    # Close the connection
    conn.close()

    if user is not None:
        user_id, username, hashed_password, email = user
        try_hash_password = hashlib.sha256(password.encode()).hexdigest()
        if try_hash_password == hashed_password:
            return jsonify({'message': "Login success"}), 200
        else:
            return jsonify({'message': "Login failed"}), 400

        
    else:
        return jsonify({'message': "Login failed"}), 400


@app.route('get_data', methods=['POST'])
def get_data_about_user():
    data = request.json
    username = data.get('username')

    if(valid_user_or_password(username,'a'*min_password_len) == False):
        illegal_input_err()

    conn = get_db_connection_for_user_password()
    # Create a cursor object to execute SQL queries
    cursor = conn.cursor()

    # Execute the SELECT query to retrieve the user by username
    cursor.execute("SELECT * FROM users WHERE username = ?", (username,))

    # Fetch the first row (user) from the result set
    user = cursor.fetchone()

    # Close the connection
    conn.close()

    if user is not None:
        email = user[3]
        
        return jsonify({'message': f"Email is: {email}"}), 200

        
    else:
        return jsonify({'message': "invalid"}), 400


if __name__ == '__main__':
    app.run()





# #####################################################
# # Adding example users
# add_user("Alice", "password123")
# add_user("Bob", "qwerty456")
# add_user("Charlie", "secret789")
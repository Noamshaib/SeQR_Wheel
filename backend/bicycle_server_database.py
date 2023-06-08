import sqlite3
import qrcode
import hashlib
import qrcode
from io import BytesIO
import re
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import os
from werkzeug.utils import secure_filename


app = Flask(__name__, static_folder= "img_static")
app.config['UPLOAD_FOLDER'] = 'img_static'
app.config['ALLOWED_EXTENSIONS'] = {'png', 'jpg', 'jpeg', 'gif'}
CORS(app)
database_bicycle = 'bicycle.db'
database_user_password = 'users_pass_email.db'

max_user_len = 15
min_user_len = 5
max_password_len = 18
min_password_len = 7


# Generate a QR code and send it to the client
@app.route('/generate_qr_code/<serial_num>')
def generate_qr_code(serial_num):
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=10,
        border=4,
    )
    qr.add_serial_num(serial_num)
    qr.make(fit=True)

    # Generate an image from the QR code
    img = qr.make_image(fill_color="black", back_color="white")

    # Save the image to a byte buffer
    img_buffer = BytesIO()
    img.save(img_buffer)
    img_buffer.seek(0)

    # Return the image data as a response
    return send_file(img_buffer, mimetype='image/png')

@app.route('/scan_qr_code/<serial_num>')
def scan_qr_code(serial_num):
    conn = get_db_connection_for_bicycle()
    # Create a cursor object to execute SQL queries
    cursor = conn.cursor()

    # Execute the SELECT query to retrieve the user by username
    cursor.execute("SELECT * FROM bicycle WHERE serial_num = ?", (serial_num,))
    line = cursor.fetchone()

    conn.close()

    if line is not None:
        return jsonify(line), 200
        
    else:
        return jsonify({'message': "Invalid QR code"}), 400

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
@app.route('/api/sign_up', methods=['POST'])
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
@app.route('/api/login', methods=['POST'])
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


@app.route('/api/get_data', methods=['POST'])
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


@app.route('/api/set_stole')
def set_stolen():
    data = request.json
    serial_num = data.get('serial_num')

    change_stolen_to_val(True, serial_num)#bicycle are stolen, so set to True

@app.route('/api/set_found')
def set_found():
    data = request.json
    serial_num = data.get('serial_num')

    change_stolen_to_val(False, serial_num)#bicycle no more stolen, so set to False

def change_stolen_to_val(stolen_bool, serial_num):
    conn = get_db_connection_for_bicycle()
    # Create a cursor object to execute SQL queries
    cursor = conn.cursor()

    # Execute the SELECT query to retrieve the user by username
    cursor.execute("UPDATE bicycle SET stolen = ? WHERE serial_num = ?", (stolen_bool,serial_num))   

    conn.commit()
    conn.close()

# Helper function to establish a database connection
def get_db_connection_for_bicycle():
    conn = sqlite3.connect(database_bicycle)
    conn.row_factory = sqlite3.Row
    return conn

def search_serial_num(serial_num):
    conn = get_db_connection_for_bicycle()
    # Create a cursor object to execute SQL queries
    cursor = conn.cursor()

    # Execute the SELECT query to retrieve the user by username
    cursor.execute("SELECT * FROM bicycle WHERE serial_num = ?", (serial_num,))

    # Fetch the first row (user) from the result set
    user = cursor.fetchone()

    return user

# Example route to create a new user
@app.route('/api/sign_up', methods=['POST'])#TODO: change the url to the relevant one.
def create_vehicle():
    data = request.json
    vehicle_type      = data.get('type')
    serial_num        = data.get('serial_num')
    #qr_code           = data.get('qr_code')
    #photos            = data.get('photos')
    owner             = data.get('owner')
    color             = data.get('color')
    size              = data.get('size')
    stolen            = False
    contact_info      = data.get('contact_info')
    photos_file = request.files.get('image')
    photos_path = None
    
    if search_serial_num(serial_num) != None:
        return jsonify({'message': 'serial number exist'}), 400

    #qr_code = set_qr_code(serial_num)
    qr_code = "111"


    if not photos_file:
        photos_path = ""  # Empty blob value
    else:
        filename = secure_filename(photos_file.filename)
        if '.' in filename and filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']:
            photos_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            photos_file.save(photos_path)
        else:
            return jsonify({'message': 'Invalid file format'}), 400

    # Create a new user
    conn = get_db_connection_for_bicycle()
    cursor = conn.cursor()

    cursor.execute("INSERT INTO users (vehicle_type,\
                                                 serial_num,\
                                                 qr_code,\
                                                 photos,\
                                                 owner,\
                                                 color,\
                                                 stolen,\
                                                 contact_info,\
                                                 size) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", (vehicle_type, serial_num, qr_code, photos_path, owner, color, stolen, contact_info, size))
                                                 
    conn.commit()
    conn.close()

    return jsonify({'message': 'Vehicle created successfully'}), 200




@app.route('/api/get_vehicle_by_serial_num', methods=['POST']) #change the path
def get_vehicle_by_serial_num():
    data = request.json
    num = data.get('serial_num')
    #TODO - check valid user input
    
    # Fetch the first row (user) from the result set
    user = search_serial_num(num)

    # Close the connection
    conn.close()
    if (user is not None)and(user[-3] == True):
        contact_info = user[-2]
        return jsonify({'message': f"The vheicle is stolen!, contact info is: {contact_info}"}), 200
    if (user is not None)and(user[-3] == False):
        return jsonify({'message': f"The vheicle belongs to someone, but isn't stolen."}), 200
    return jsonify({'message':'The vehicle belongs to no one'}),400


@app.route('/api/get_user_vehicles', methods=['POST'])
def get_user_vehicles():
    data = request.json
    username = data.get('username')
    conn = get_db_connection_for_bicycle()
    # Create a cursor object to execute SQL queries
    cursor = conn.cursor()

    # Execute the SELECT query to retrieve the user by username
    cursor.execute("SELECT * FROM bicycle WHERE owner = ?", (username,))

    # Fetch the first row (user) from the result set
    bicycles = cursor.fetchone()
    return jsonify(bicycles or []), 200



#TODO - add full name and phone to user_pass_email.db
if __name__ == '__main__':
    conn = get_db_connection_for_bicycle()

    # Create a cursor object to execute SQL queries
    cursor = conn.cursor()
    cursor.execute('''CREATE TABLE IF NOT EXISTS bicycle
                (bicycle_system_id INTEGER PRIMARY KEY AUTOINCREMENT, 
                vehicle_type TEXT NOT NULL, 
                serial_num INTEGER,
                qr_code TEXT NOT NULL,
                photos TEXT NOT NULL, 
                owner TEXT NOT NULL, 
                color TEXT NOT NULL, 
                stolen BOOLEAN, 
                contact_info TEXT NOT NULL,
                size INTEGER)''')
                
    app.run(debug = True)
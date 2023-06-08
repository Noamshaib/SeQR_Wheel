import sqlite3
import qrcode
import hashlib
import qrcode
from io import BytesIO
import re
from flask import Flask, request, jsonify, send_file

app = Flask(__name__)
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


def store_image_in_database(image_data):
    # Establish a connection to the database
    conn = get_db_connection_for_bicycle()
    cursor = conn.cursor()

    # Insert the image data into the database
    cursor.execute("INSERT INTO bicycle (photos) VALUES (?)", (image_data,))
    conn.commit()

    # Close the database connection
    conn.close()

def fetch_image_from_database():
    # Establish a connection to the database
    conn = sqlite3.connect(database_file)
    cursor = conn.cursor()

    # Fetch the latest image from the database
    cursor.execute("SELECT image_data FROM images ORDER BY id DESC LIMIT 1")
    result = cursor.fetchone()

    # Close the database connection
    conn.close()

    if result is not None:
        # Return the image data
        return result[0]
    else:
        return None

@app.route('/upload_image', methods=['POST'])
def upload_image():
    image_file = request.files.get('image')

    if image_file:
        # Read the image data from the file
        image_data = image_file.read()

        # Store the image in the database
        store_image_in_database(image_data)

        # Return a success message
        return jsonify({'message': 'Image uploaded successfully'}), 200
    else:
        return jsonify({'message': 'No image file received'}), 400

@app.route('/download_image', methods=['GET'])
def download_image():
    # Fetch the latest image from the database
    image_data = fetch_image_from_database()

    if image_data:
        # Create a temporary file to store the image data
        temp_file = 'temp_image.jpg'
        with open(temp_file, 'wb') as file:
            file.write(image_data)

        # Send the image file back to the client
        return send_file(temp_file, mimetype='image/jpeg', as_attachment=True, attachment_filename='image.jpg')
    else:
        return jsonify({'message': 'No image found in the database'}), 404



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
    #add another database saperated from user - password to the all other data

    data = request.json
    vehicle_type      = data.get('type')
    #bicycle_system_id = data.get('bicycle_id') #our own id, not the one written on the bike
    serial_num        = data.get('serial_num')
    #qr_code           = data.get('qr_code')
    photos            = data.get('photos')
    owner             = data.get('owner')
    color             = data.get('color')
    size              = data.get('size')
    stolen            = False
    contact_info      = data.get('contact_info')


    #TODO: GENERATE A QR code & bicycle_id
    if search_serial_num(serial_num) != None:
        return jsonify({'message': 'serial number exist'}), 400
    #bicycle_system_id = set_vehicle_id()
    #TODO - fix it so it will generate QR code
    #qr_code = set_qr_code(serial_num)
    qr_code = "111"
    
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
                                                 size) VALUES ?", (vehicle_type, serial_num, qr_code, photos, owner, color, stolen, contact_info, size))
                                                 
    conn.commit()
    conn.close()

    return jsonify({'message': 'Vehicle created successfully'}), 200




@app.route('/api/get_vehicle_by_serial_num', methods=['POST']) #change the path
def get_vehicle_by_serial_num():#TODO:
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

#def set_vehicle_id():

if __name__ == '__main__':
    conn = get_db_connection_for_bicycle()

    # Create a cursor object to execute SQL queries
    cursor = conn.cursor()
    cursor.execute('''CREATE TABLE IF NOT EXISTS bicycle
                (bicycle_system_id INTEGER PRIMARY KEY AUTOINCREMENT, 
                vehicle_type TEXT NOT NULL, 
                serial_num INTEGER,
                qr_code TEXT NOT NULL,
                photos BLOB NOT NULL, 
                owner TEXT NOT NULL, 
                color TEXT NOT NULL, 
                stolen BOOLEAN, 
                contact_info TEXT NOT NULL,
                size INTEGER)''')
                
    app.run()
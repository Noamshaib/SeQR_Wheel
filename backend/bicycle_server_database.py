import sqlite3
import qrcode
import hashlib
import re
from flask import Flask, request, jsonify

app = Flask(__name__)
database_bicycle = 'bicycle.db'

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
    cursor.execute("SELECT * FROM bicycle WHERE serial_num = ?", (num,))

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
                photos TEXT NOT NULL, 
                owner TEXT NOT NULL, 
                color TEXT NOT NULL, 
                stolen BOOLEAN, 
                contact_info TEXT NOT NULL,
                size INTEGER)''')
                
    app.run()
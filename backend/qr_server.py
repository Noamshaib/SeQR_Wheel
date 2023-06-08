from flask import Flask, send_file, jsonify
import qrcode
from io import BytesIO
import sqlite3

app = Flask(__name__)
database_bicycle = 'bicycle.db'

# Helper function to establish a database connection
def get_db_connection_for_bicycle():
    conn = sqlite3.connect(database_bicycle)
    conn.row_factory = sqlite3.Row
    return conn


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



# Example usage: http://localhost:5000/generate_qr_code/Hello,%20World!
if __name__ == '__main__':
    app.run()

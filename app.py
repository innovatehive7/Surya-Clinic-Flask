from flask import Flask, send_from_directory, request, jsonify

app = Flask(__name__, static_folder='public', static_url_path='')

# Route to serve the home page
@app.route('/')
def index():
    return send_from_directory('public', 'index.html')

# Route to serve the Ayurvedic page
@app.route('/ayurvedic')
def ayurvedic():
    return send_from_directory('public', 'ayurvedic.html')

# Route to serve the Dental page
@app.route('/dental')
def dental():
    return send_from_directory('public', 'dental.html')

# Route to handle appointment booking (new route)
@app.route('/book-appointment', methods=['POST'])
def book_appointment():
    try:
        # Get JSON data from the request
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['name', 'phone', 'email', 'date', 'service', 'doctor', 'submissionTime']
        for field in required_fields:
            if not data.get(field):
                return jsonify({"message": f"Missing required field: {field}"}), 400

        # Here, you can add logic to save the appointment to a database
        # For now, we'll just return a success response
        return jsonify({"message": "Appointment booked successfully"}), 200
    except Exception as e:
        return jsonify({"message": f"Error: {str(e)}"}), 500

# This allows serving all static files (like CSS, JS, images) from public folder
@app.route('/<path:path>')
def static_files(path):
    return send_from_directory('public', path)

if __name__ == '__main__':
    app.run(debug=True, port=5000)

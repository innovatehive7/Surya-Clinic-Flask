from flask import Flask, send_from_directory

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

# This allows serving all static files (like CSS, JS, images) from public folder
@app.route('/<path:path>')
def static_files(path):
    return send_from_directory('public', path)

if __name__ == '__main__':
    app.run(debug=True)

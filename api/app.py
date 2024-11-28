from flask import Flask
from flask_cors import CORS
from flask_socketio import SocketIO
from routes.routes import routes_bp
from routes.notification_routes import register_notification_routes

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})
app.register_blueprint(routes_bp, url_prefix='/api')

socketio = SocketIO(app, cors_allowed_origins="*")
register_notification_routes(socketio)

@app.route('/')
def home():
    return "Pagina principal"

@app.route('/favicon.ico')
def favicon():
    return "", 204

if __name__ == '__main__':
    socketio.run(app, debug=True)
from flask import Flask
from flask_cors import CORS
from flask_socketio import SocketIO
from flask_jwt_extended import JWTManager
from routes.routes import routes_bp
from datetime import timedelta 
from routes.notification_routes import register_notification_routes

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})
app.register_blueprint(routes_bp, url_prefix='/api')


app.config['JWT_SECRET_KEY'] = 'your_secret_key'  

app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(minutes=5)

socketio = SocketIO(app, cors_allowed_origins="*")
register_notification_routes(socketio)

jwt = JWTManager(app)

@app.before_request
def middleware():
    print("Middleware")

@app.route('/')
def home():
    return "Pagina principal"

@app.route('/favicon.ico')
def favicon():
    return "", 204


if __name__ == '__main__':
    socketio.run(app, debug=True)
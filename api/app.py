from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from routes.routes import routes_bp
from datetime import timedelta 

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})
app.register_blueprint(routes_bp, url_prefix='/api')


app.config['JWT_SECRET_KEY'] = 'your_secret_key'  #Cambiar la clave y ponerla de forma segura

app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(minutes=50)

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
    app.run(app, debug=True)
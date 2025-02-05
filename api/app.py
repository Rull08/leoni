import logging
from logging.handlers import RotatingFileHandler
import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required
from flask_caching import Cache
from sqlalchemy.exc import ProgrammingError
from services.services import login_user, get_all_materials, set_all_ubications, add_material, search_material, exact_search_material, count_ubicactions, get_users, delete_material, search_older, move_material
from datetime import datetime

from datetime import timedelta 

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s %(levelname)s %(message)s'
)

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": ["http://localhost:3000", "http://localhost:5000"]}}, supports_credentials=True)

#app.register_blueprint(routes_bp, url_prefix='/api')

app.config['CACHE_TYPE'] = 'SimpleCache'
app.config['CACHE_REDIS_HOST'] = 'localhost'
app.config['CACHE_REDIS_PORT'] = 6379
app.config['CACHE_DEFAULT_TIMEOUT'] = 300  # 5 minutos
cache = Cache(app)

app.config['JWT_SECRET_KEY'] = os.getenv("KEY")  #Cambiar la clave y ponerla de forma segura
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(minutes=60)

jwt = JWTManager(app)

# Crear directorio de logs si no existe
if not os.path.exists("logs"):
    os.makedirs("logs")

# Configuración de logging
log_file = "logs/api.log"
logging.basicConfig(
    level=logging.DEBUG,
    format="%(asctime)s - %(levelname)s - %(message)s",
    handlers=[
        RotatingFileHandler(log_file, maxBytes=10_000_000, backupCount=5),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

# Manejador centralizado de errores
@app.errorhandler(Exception)
def handle_exception(e):
    logging.error("Error interno %s", e, exc_info=True)
    return jsonify({"error": "Error interno del sertvidor"}), 500

# Middleware (por ejemplo, para logging de cada request)
@app.before_request
def before_request():
    logging.info("Solicitud %s %s", request.method, request.path)

    
# Endpoints

@app.route('/')
def home():
    return "Pagina principal"

@app.route('/favicon.ico')
def favicon():
    return "", 204

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    user_name = data['user_name']
    user_password = data['user_password']
    user_rol = data['user_rol']
    autenticacion = data['autenticacion']
    logged_user = login_user(user_name, user_password, user_rol, autenticacion)
    
    if logged_user and logged_user.autenticacion:
        access_token = create_access_token(
            identity=logged_user.user_name, 
            additional_claims={"role": logged_user.user_rol}
            )
        return jsonify(access_token=access_token), 200
    else:
        return jsonify({'error': 'Invalid User'}), 401

@app.route('/api/search_materials', methods=['POST'])
@jwt_required()
def search_materials():
    data = request.get_json()
    doe = data.get('obj')
    page = data.get('page', 1)
    limit = data.get('limit', 10)
    sort_field = data.get('sort_field', 'id_material')
    sort_order = data.get('sort_order', 'asc')
    
    materials = search_material(doe, page, limit, sort_field, sort_order)
    if materials:
        material_list = [{
            "id_material": row[0],
            "num_parte": row[1],
            "num_serie": row[2],
            "cant_kilos": row[4],
            "cant_metros": row[5],
            "user": row[6],
            "ubicacion": row[7],
            "fecha_produccion": row[9],
            "fecha_entrada": row[10]
        } for row in materials]
        return jsonify(material_list), 200
    return jsonify({'error': 'Materials not found'}), 404

@app.route('/api/add_material', methods=['POST'])
@jwt_required()
def add_materials():
    data = request.get_json()
    part_num = data['part_num']
    serial_num = data['serial_num']
    long_quantity = data['long_quantity']
    operator = data['operator']
    ubication = data['ubication']
    respuesta = data['respuesta']
    production_date_str = data['production_date']  
    
    try:
        production_date = datetime.strptime(production_date_str, '%Y-%m-%d').date()
    except ValueError:
        return jsonify({'error': 'Fecha de producción inválida. El formato debe ser YYYY-MM-DD'}), 400

    
    result = add_material( part_num, serial_num, long_quantity, operator, ubication, production_date, respuesta)
    logging.info(result)
    return jsonify(result)

@app.route('/api/exact_search', methods=['POST'])
@jwt_required()
def exact_search():
    data = request.get_json()
    search = data.get('search')
    
    result  = exact_search_material(search)
    
    if result:
        search_reault = [{
            "num_parte": row[0],
            "num_serie": row[1],
            "nombre_ubicacion": row[2],
            "nombre_rack": row[3],
        } for row in result]
        
        return jsonify(search_reault), 200
    return jsonify({'error': 'Material not found'}), 404

@app.route('/api/search_older', methods=['POST'])
@jwt_required()
def get_search_older():
    data = request.get_json()
    search = data.get('search')
    
    try:
        result = search_older(search)

        if result:
            search_reault = [{
                "id_material": row[0],
                "num_parte": row[1],
                "num_serie": row[2],
                "operador": row[3],
                "ubicacion": row[4],
                "fecha_produccion": row[5],
                "fecha_entrada": row[6],
                "cant_metros": row[7],
                "nombre_ubicacion": row[8],
                "nombre_rack": row[9],
            } for row in result]
        
            return jsonify(search_reault), 200
        else:
            return jsonify({'error': 'Material not found'}), 404

    except Exception as e:
        return jsonify({'error': 'Error al buscar', 'detalle': e}), 500

@app.route('/api/move_material', methods=['POST'])
@jwt_required()
def set_move_material():
    data = request.get_json()
    serial_num = data.get('num_serie')
    new_ubication = data.get('nueva_ubicacion')
    
    if not serial_num or not new_ubication:
        return jsonify({"error": "Faltan datos"}), 400
    
    try:
        result = move_material(serial_num, new_ubication)
        print(result)
        if result:
            return jsonify({'error': 'El material no se pudo mover'}), 404
        else:
            return jsonify({'Exito': 'Material movido correctamente'}), 200
    
    except Exception as e:
        # Capturar cualquier otro error general
        return jsonify({"error": f"Ha ocurrido un error: {str(e)}"}), 500

@app.route('/api/delete_material', methods=['DELETE'])
@jwt_required()
def set_delete_material():
    serial = request.args.get('serial_num'),
    logging.info("Datos recibidos para eliminar: %s", serial)
    if not serial:
        return jsonify({'error': 'El campo serial_num es requerido'}), 400

    try:
        result = delete_material(serial)

        if result:
            return jsonify({'error': 'El material no se pudo eliminar'}), 404
        else:
            return jsonify({'Exito': 'Material eliminado correctamente'}), 200

    except ProgrammingError as e:
        error_message = str(e.orig)  # Extraer el mensaje original de PostgreSQL
        if "Solo se puede eliminar el material con la fecha más antigua" in error_message:
            return jsonify({'error': 'Solo se puede eliminar el material con la fecha más antigua en este rack'}), 400
        return jsonify({'error': 'Error al eliminar material', 'detalle': error_message}), 500
    
@app.route('/api/materials', methods=['GET'])
@cache.cached(timeout=60, query_string=True)
@jwt_required()
def get_materials():
    try:
        page = request.args.get('page', 1, type=int)
        limit_param = request.args.get('limit', '10')
        if limit_param.upper() == 'ALL':
            limit = 999999
        else:
            try:
                limit = int(limit_param)
            except ValueError:
                limit = 10

        sort_field = request.args.get('sort_field', 'id_material')
        sort_order = request.args.get('sort_order', 'ASC')
        
        materials, total_items = get_all_materials(page, limit, sort_field, sort_order)
        
        # Calcular páginas (si no se usa 'all')
        page_limit = limit if limit != 'all' else total_items
        total_pages = (total_items + page_limit - 1) // page_limit if page_limit else 1

        # Formatear la respuesta (asumiendo una estructura conocida de los datos)
        material_list = [{
            "id_material": row[0],
            "num_parte": row[1],
            "num_serie": row[2],
            "nombre_clasificacion": row[3],
            "cant_kilos": row[4],
            "cant_metros": row[5],
            "user": row[6],
            "ubicacion": row[7],
            "tipo": row[8],
            "fecha_produccion": row[9],
            "fecha_entrada": row[10]
        } for row in materials] if materials else []
        
        return jsonify({
            "materials": material_list,
            "total_items": total_items,
            "total_pages": total_pages,
            "current_page": page
        }), 200
    except Exception as e:
        logging.error("Error en get_materials: %s", e, exc_info=True)
        return jsonify({"error": "No se pudieron obtener los materiales"}), 500

@app.route('/api/ubications', methods=['GET'])
@cache.cached(timeout=60, query_string=True)
@jwt_required()
def set_ubications():
    rack_name = request.args.get('rack_name')
    ubication = set_all_ubications(rack_name)
    count  = count_ubicactions(rack_name)
    
    if ubication:
        material_list = [{
            "id_material": row[0], 
            "num_parte": row[1], 
            "num_serie": row[2], 
            "cant_metros": row[8],
            "user": row[3], 
            "ubicacion": row[4], 
            "fecha_produccion": row[5].strftime("%d/%m/%Y") if row[5] else None,
            "fecha_entrada": row[6].strftime("%d/%m/%Y") if row[6] else None,
            "nombre_rack": row[7],
            "nombre_ubicacion": row[9]
            } for row in ubication]
        
        slots_count = [{
            "id_ubicacion": row[0],
            "nombre_ubicacion": row[1],
            "capacidad_maxima": row[2],
            "estado": row[3],
            "nombre_rack": row[4]
            } for row in count] 
        
        result = {
            "materials": material_list,
            "count": slots_count 
        }
        return jsonify(result)
    return jsonify({'error': 'Ubications not found'}), 404

@app.route('/api/users', methods=['GET'])
@cache.cached(timeout=60, query_string=True)
@jwt_required()
def set_get_users():
    try:
        page = request.args.get('page', 1, type=int)
        limit_param = request.args.get('limit', '10')
        if limit_param.upper() == 'ALL':
            limit = 999999
        else:
            try:
                limit = int(limit_param)
            except ValueError:
                limit = 10

        sort_field = request.args.get('sort_field', 'id')
        sort_order = request.args.get('sort_order', 'ASC')
        
        users, total_users = get_users(page, limit, sort_field, sort_order)
    
        # Calcular páginas (si no se usa 'all')
        page_limit = limit if limit != 'ALL' else total_users
        total_pages = (total_users + page_limit - 1) // page_limit if page_limit else 1

        # Formatear la respuesta (asumiendo una estructura conocida de los datos)
        users = [{
            "usuario": row[0],
            "contrasena": row[1],
            "id": row[2],
            "rol" :row[3],
        } for row in users] if users else []
        
        return jsonify({
            "users": users,
            "total_users": total_users,
            "total_pages": total_pages,
            "current_page": page
        }), 200
    except Exception as e:
        logging.error("Error en get_materials: %s", e)
        return jsonify({"error": "No se pudieron obtener los materiales"}), 500

@app.errorhandler(Exception)
def handle_exception(e):
    logging.error("Error inesperado: %s", e, exc_info=True)
    return jsonify({"error": "Error interno del servidor"}), 500


if __name__ == '__main__':
    app.run(app, debug=True)
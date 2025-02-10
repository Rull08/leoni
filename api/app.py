import logging
import os
import services.services as srv
from logging.handlers import RotatingFileHandler
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt
from flask_caching import Cache
from sqlalchemy.exc import ProgrammingError
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
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(minutes=5)

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
    logged_user = srv.login_user(user_name, user_password, user_rol, autenticacion)
    
    if logged_user and logged_user.autenticacion:
        access_token = create_access_token(
            identity=logged_user.user_name, 
            additional_claims={"role": logged_user.user_rol}
            )
        
        now = datetime.now()
        user_date = now.date() 
        user_time = now.time()
        
        srv.update_record(logged_user.user_name, logged_user.user_rol, "Inicio de Sesión", user_date, user_time)       
        
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
    
    materials = srv.search_material(doe, page, limit, sort_field, sort_order)
    if materials:
        material_list = [{
            "id_material": row[0],
            "num_parte": row[1],
            "num_serie": row[2],
            "user": row[3],
            "ubicacion": row[4],
            "rack": row[5],
            "fecha_produccion": row[6],
            "fecha_entrada": row[7],
            "cant_metros": row[8]
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

    
    result = srv.add_material( part_num, serial_num, long_quantity, operator, ubication, production_date, respuesta)
    
    jwt_data = get_jwt()
    user = jwt_data.get("sub")  
    user_role = jwt_data.get("role")  
    action = (f"Entrada de material (Numero de serie: {serial_num}, Numero de parte: {part_num}, Cantidad: {long_quantity}, Ubicacion: {ubication}, Fecha de produccion: {production_date})")
    now = datetime.now()
    user_date = now.date() 
    user_time = now.time()
    
    srv.update_record(user, user_role, action, user_date, user_time)
    
    logging.info(result)
    return jsonify(result)

@app.route('/api/exact_search', methods=['POST'])
@jwt_required()
def exact_search():
    data = request.get_json()
    search = data.get('search')
    
    result  = srv.exact_search_material(search)
    
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
        result = srv.search_older(search)

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
    
@app.route('/api/search_user', methods=['POST'])
@jwt_required()
def search_user():
    data = request.get_json()
    search = data.get('search')
    
    result  = srv.search_user(search)
    
    if result: 
        users = [{
            "usuario": row[0],
            "contrasena": row[1],
            "id": row[2],
            "rol" :row[3],
        } for row in result]
        
        return jsonify(users), 200
    return jsonify({'error': 'User not found'}), 404

@app.route('/api/move_material', methods=['POST'])
@jwt_required()
def set_move_material():
    data = request.get_json()
    serial_num = data.get('num_serie')
    original_ubication = data.get('ubicacion_original')
    new_ubication = data.get('nueva_ubicacion')
    
    if not serial_num or not new_ubication:
        return jsonify({"error": "Faltan datos"}), 400
    
    try:
        result = srv.move_material(serial_num, new_ubication)
        print(result)
        if result:
            
            return jsonify({'error': 'El material no se pudo mover'}), 404
        else:
            jwt_data = get_jwt()
            user = jwt_data.get("sub")  
            user_role = jwt_data.get("role") 
            action = (f"Cambio de ubicacion: (Numero de serie: {serial_num} de {original_ubication} a {new_ubication})")
            now = datetime.now()
            user_date = now.date() 
            user_time = now.time()
    
            srv.update_record(user, user_role, action, user_date, user_time)
            return jsonify({'Exito': 'Material movido correctamente'}), 200
    
    except Exception as e:
        
        return jsonify({"error": f"Ha ocurrido un error: {str(e)}"}), 500
    
@app.route('/api/add_user', methods=['POST'])
@jwt_required()
def set_add_user():
    data = request.get_json()
    user_name = data['user_name']
    user_password = data['user_password']
    user_rol = data['user_rol']
    
    try:
        result = srv.add_user(user_name, user_password, user_rol)
        
        jwt_data = get_jwt()
        user = jwt_data.get("sub")  
        user_role = jwt_data.get("role") 
        action = (f"Usuario agregado: (Usuario: {user_name}, rol asignado: {user_rol})")
        now = datetime.now()
        user_date = now.date() 
        user_time = now.time()

        srv.update_record(user, user_role, action, user_date, user_time)
        
        if result:
            return jsonify({'error': 'No se pudo agregar el susuario'}), 404
        else:
            return jsonify({'Exito': 'Usuario agregado correctamente'}), 200
    
    except Exception as e:
        
        return jsonify({"error": f"Ha ocurrido un error: {str(e)}"}), 500 
    
@app.route('/api/delete_material', methods=['DELETE'])
@jwt_required()
def set_delete_material():
    serial = request.args.get('serial_num'),
    logging.info("Datos recibidos para eliminar: %s", serial)
    if not serial:
        return jsonify({'error': 'El campo serial_num es requerido'}), 400

    try:
        result = srv.delete_material(serial)

        if result:
            return jsonify({'error': 'El material no se pudo eliminar'}), 404
        else:
            
            jwt_data = get_jwt()
            user = jwt_data.get("sub")  
            user_role = jwt_data.get("role") 
            action = (f"Material eliminado: (Numero de serie: {serial})")
            now = datetime.now()
            user_date = now.date() 
            user_time = now.time()
    
            srv.update_record(user, user_role, action, user_date, user_time)
            
            return jsonify({'Exito': 'Material eliminado correctamente'}), 200

    except ProgrammingError as e:
        error_message = str(e.orig)  # Extraer el mensaje original de PostgreSQL
        if "Solo se puede eliminar el material con la fecha más antigua" in error_message:
            return jsonify({'error': 'Solo se puede eliminar el material con la fecha más antigua en este rack'}), 400
        return jsonify({'error': 'Error al eliminar material', 'detalle': error_message}), 500
    
@app.route('/api/massive_delete', methods=['DELETE'])
@jwt_required()
def set_massive_delete():
    part = request.args.get('part_num'),
    logging.info("Datos recibidos para eliminar: %s", part)
    if not part:
        return jsonify({'error': 'El campo part_num es requerido'}), 400

    try:
        result = srv.massive_delete(part)

        if result:
            return jsonify({'error': 'El material no se pudo eliminar'}), 404
        else:
            jwt_data = get_jwt()
            user = jwt_data.get("sub")  
            user_role = jwt_data.get("role") 
            action = (f"Eliminacion masiva: (Numero de parte: {part})")
            now = datetime.now()
            user_date = now.date() 
            user_time = now.time()
    
            srv.update_record(user, user_role, action, user_date, user_time)
            
            return jsonify({'Exito': 'Material eliminado correctamente'}), 200
    
    except Exception as e:
        
        return jsonify({"error": f"Ha ocurrido un error: {str(e)}"}), 500

@app.route('/api/delete_user', methods=['DELETE'])
@jwt_required()
def get_delete_user():
    id_user = request.args.get('id_user')
    user_name = request.args.get('user_name')
    logging.info("Datos enviados para eliminar: %s y %s", id_user, user_name)
    
    if not id_user or not user_name:
        return jsonify({'error': 'Faltan datos'}), 400
    
    try: 
        result = srv.delete_user(id_user, user_name)
        
        if result: 
            return jsonify({'error': 'No se pudo eliminar al usuario'}, 404)
        else:
            
            jwt_data = get_jwt()
            user = jwt_data.get("sub")  
            user_role = jwt_data.get("role") 
            action = (f"Usuario eliminado: (Usuario: {user_name})")
            now = datetime.now()
            user_date = now.date() 
            user_time = now.time()
    
            srv.update_record(user, user_role, action, user_date, user_time)
            
            return jsonify({'error': 'Usuario eliminado correctamente'}), 200
        
    except Exception as e:
        logging.error("Error eliminando usuario: %s", e, exc_info=True)
        return jsonify({"error": f"Ha ocurrido un error: {str(e)}"}), 500 

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
        
        materials, total_items = srv.get_all_materials(page, limit, sort_field, sort_order)
        
        page_limit = limit if limit != 'all' else total_items
        total_pages = (total_items + page_limit - 1) // page_limit if page_limit else 1

        material_list = [{
            "id_material": row[0],
            "num_parte": row[1],
            "num_serie": row[2],
            "user": row[3],
            "ubicacion": row[4],
            "rack": row[5],
            "fecha_produccion": row[6],
            "fecha_entrada": row[7],
            "cant_metros": row[8]
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
    ubication = srv.set_all_ubications(rack_name)
    count  = srv.count_ubicactions(rack_name)
    
    if ubication:
        material_list = [{
            "id_material": row[0],
            "num_parte": row[1],
            "num_serie": row[2],
            "user": row[3],
            "ubicacion": row[4],
            "rack": row[5],
            "fecha_produccion": row[6],
            "fecha_entrada": row[7],
            "cant_metros": row[8]
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
        
        users, total_users = srv.get_users(page, limit, sort_field, sort_order)
    
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

@app.route('/api/record', methods=['GET'])
@cache.cached(timeout=60, query_string=True)
@jwt_required()
def get_record():
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
        
        record, total_items = srv.get_record(page, limit, sort_field, sort_order)
        
        page_limit = limit if limit != 'all' else total_items
        total_pages = (total_items + page_limit - 1) // page_limit if page_limit else 1

        record_list = [{
            "id_registro": row[0],
            "usuario": row[1],
            "rol": row[2],
            "operacion": row[3],
            "fecha": row[4],
            "hora": row[5],
        } for row in record] if record else []
        
        return jsonify({
            "record": record_list,
            "total_items": total_items,
            "total_pages": total_pages,
            "current_page": page
        }), 200
    except Exception as e:
        logging.error("Error en get_record: %s", e, exc_info=True)
        return jsonify({"error": "No se pudo obtener el registro"}), 500

@app.route('/api/update_user', methods=['PUT'])
@jwt_required("admin")
def set_update_user():
    data = request.get_json()
    user_id = data.get('id')
    user_name = data.get('usuario')
    user_password = data.get('contrasena')
    user_rol = data.get('rol')
    
    if not user_id:
        return jsonify({'error': 'El campo id es requerido para actualizar el usuario'}), 400

    try:
        result = srv.update_user(user_id, user_name, user_password, user_rol)
        
        if result:
            return jsonify({'error': 'No se pudo actualizar el usuario'}), 404
        else:
            
            jwt_data = get_jwt()
            user = jwt_data.get("sub")  
            user_role = jwt_data.get("role") 
            action = (f"Actualizacion de usuario: (Usuario: {user_name}, Contraseña *******, Rol: {user_rol})")
            now = datetime.now()
            user_date = now.date() 
            user_time = now.time()
    
            srv.update_record(user, user_role, action, user_date, user_time)
            
            return jsonify({'Exito': 'Usuario actualizado correctamente'}), 200
    
    except Exception as e:
        return jsonify({"error": f"Ha ocurrido un error: {str(e)}"}), 500



if __name__ == '__main__':
    app.run(app, debug=True)
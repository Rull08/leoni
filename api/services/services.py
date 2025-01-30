from config import StoredProcedures
from database import execute_procedure, execute_query
from models.models import Login, Material

def login_user(user_name, user_password, user_rol, autenticacion):
    params = (user_name, user_password, user_rol, autenticacion)
    result = execute_procedure(StoredProcedures.LOGIN_USER, params)
    if result:
        return Login(user_name, user_password, result[0][0], result[0][1])
    return None

def get_all_materials(page, limit, sort_field, sort_order):
    if limit == 'all':
        offset = 0  
    else:
        offset = (page - 1) * limit
        
    query = f"SELECT * FROM {StoredProcedures.GET_MATERIAL}() ORDER BY {sort_field} {sort_order} LIMIT {limit} OFFSET {offset}"
    print(query)
    materials = execute_query(query)
    
    count_query = f"SELECT COUNT(*) FROM {StoredProcedures.GET_MATERIAL}()"
    total_items = execute_query(count_query)[0][0]
    
    return materials, total_items

def search_material(doe, page, limit, sort_field, sort_order):
    if limit == 'all':
        offset = 0  
    else:
        offset = (page - 1) * limit
    
    query = f" SELECT * FROM {StoredProcedures.SEARCH_MATERIAL}('{doe}') ORDER BY {sort_field} {sort_order} LIMIT {limit} OFFSET {offset}" 
    return execute_query(query)

def get_users(page, limit, sort_field, sort_order):
    if limit == 'all':
        offset = 0  
    else:
        offset = (page - 1) * limit
    
    query = f"SELECT * FROM usuarios ORDER BY {sort_field} {sort_order} LIMIT {limit} OFFSET {offset}"
    users = execute_query(query)
    print(users)
    count_query = f"SELECT COUNT(*) FROM usuarios"
    total_users = execute_query(count_query)[0][0]
    
    return users, total_users

def set_all_ubications(rack_name):
    query = f"SELECT m.*, r.nombre_rack, u.nombre_ubicacion FROM materiales m INNER JOIN ubicaciones u on m.ubicacion = u.id_ubicacion INNER JOIN racks r ON u.id_rack = r.id_rack WHERE r.nombre_rack = '{rack_name}';"
    return execute_query(query)

def count_ubicactions(rack_name):
    query = f"SELECT u.id_ubicacion, u.nombre_ubicacion, u.capacidad_maxima, u.estado, r.nombre_rack FROM ubicaciones u INNER JOIN racks r ON u.id_rack = r.id_rack  WHERE r.nombre_rack = '{rack_name}';"
    return execute_query(query)

def add_material(types, part_num, serial_num, weight_quantity, long_quantity, operator, clasification, ubication, respuesta="N/A"):
    flatter_params = (types, part_num, serial_num, weight_quantity, long_quantity, operator, clasification, ubication, respuesta)
    params_list = [item[0]  if isinstance(item, tuple) else item for item in flatter_params]
    params = tuple(params_list)
    result = execute_procedure(StoredProcedures.ADD_MATERIAL, params)
    print(f"Respuesta: {result}")
    return None
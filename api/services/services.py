from config import StoredProcedures
from database import execute_procedure, execute_query
from models.models import Login, Material
from sqlalchemy import text
import logging


def login_user(user_name, user_password, user_rol, autenticacion):
    params = (user_name, user_password, user_rol, autenticacion)
    result = execute_procedure(StoredProcedures.LOGIN_USER, params)
    
    if result and len(result) > 0 and len(result[0]) >= 2:
        return Login(user_name, '********',result[0][0], result[0][1])
    return None

def add_user(user_name, user_password, user_rol):
    params = (user_name, user_password, user_rol)
    result = execute_procedure(StoredProcedures.ADD_USER, params)
    print(f"Respuesta: {result}")
    return None

def get_all_materials(page, limit, sort_field, sort_order):

    if limit == 'ALL':
        limit = 999999
        offset = 0  
    else:
        offset = (page - 1) * limit
        
    # Construimos la consulta con los valores validados
    query = text(f"""
    SELECT * FROM {StoredProcedures.GET_MATERIAL}()
    ORDER BY {sort_field} {sort_order}
    LIMIT :limit OFFSET :offset
    """)

    # Los parámetros se pasan de forma segura para LIMIT y OFFSET
    params = {
        "limit": limit,
        "offset": offset
    }
    
    materials = execute_query(query, params)
    
    count_query = text(f"SELECT COUNT(*) FROM {StoredProcedures.GET_MATERIAL}()")
    total_items = execute_query(count_query)[0][0]
    
    return materials, total_items

def search_material(doe, page, limit, sort_field, sort_order):

    if limit == 'ALL':
        limit = 999999
        offset = 0  
    else:
        offset = (page - 1) * limit
    
    query = text(f"""
    SELECT * FROM {StoredProcedures.SEARCH_MATERIAL}(:doe) 
    ORDER BY {sort_field} {sort_order} 
    LIMIT :limit OFFSET :offset
    """ )
    
    params = {
        "doe": doe,
        "limit": limit,
        "offset": offset
    }
    
    return execute_query(query, params)

def get_users(page, limit, sort_field, sort_order):
    
    if limit == 'ALL':
        limit = 999999
        offset = 0  
    else:
        offset = (page - 1) * limit
    
    query = text(f"""
        SELECT * FROM usuarios 
        ORDER BY {sort_field} {sort_order}
        LIMIT :limit OFFSET :offset
    """)

    params = {"limit": limit, "offset": offset}

    users = execute_query(query, params)
    
    count_query = text("SELECT COUNT(*) FROM usuarios")
    total_users = execute_query(count_query)[0][0]
    
    return users, total_users

def set_all_ubications(rack_name):
    query = text("""
    SELECT m.*, r.nombre_rack, u.nombre_ubicacion 
    FROM materiales m 
    INNER JOIN ubicaciones u on m.ubicacion = u.id_ubicacion 
    INNER JOIN racks r ON u.id_rack = r.id_rack WHERE r.nombre_rack = :rack_name;
    """)
    
    return execute_query(query, {"rack_name": rack_name})

def get_record(page, limit, sort_field, sort_order):
    
    if limit == 'ALL':
        limit = 999999
        offset = 0  
    else:
        offset = (page - 1) * limit
    
    query = text(f"""
        SELECT * FROM registro 
        ORDER BY {sort_field} {sort_order}
        LIMIT :limit OFFSET :offset
    """)

    params = {"limit": limit, "offset": offset}

    record = execute_query(query, params)
    
    count_query = text("SELECT COUNT(*) FROM registro")
    total_record = execute_query(count_query)[0][0]
    
    return record, total_record


def exact_search_material(search):
    
    # Verificar si el valor es numérico o una cadena
    if isinstance(search, int):  
        search_numeric = search
        search_string = str(search)  # Convertimos el número en string por compatibilidad
    else:
        try:
            search_numeric = int(search)  # Intentamos convertirlo en número
            search_string = str(search)  # Guardamos también como string para búsqueda
        except ValueError:
            search_numeric = None  # Si falla, lo dejamos como None
            search_string = search  # Lo tratamos solo como string
        
    query = text(f"""
                 SELECT m.num_parte, m.num_serie, u.nombre_ubicacion, r.nombre_rack
                 FROM materiales m
				 INNER JOIN ubicaciones u ON m.ubicacion = u.id_ubicacion
				 INNER JOIN racks r ON u.id_rack = r.id_rack
                 WHERE num_parte = :search_string
                 OR num_serie = :search_numeric  
            """)
    
    params = {
        "search_string": search_string,  # Siempre como string para num_parte
        "search_numeric": search_numeric  # Solo si es un número
    }
    
    return execute_query(query, params)

def count_ubicactions(rack_name):
    query = text("""
                    SELECT u.id_ubicacion, u.nombre_ubicacion, u.capacidad_maxima, u.estado, r.nombre_rack 
                    FROM ubicaciones u 
                    INNER JOIN racks r ON u.id_rack = r.id_rack  
                    WHERE r.nombre_rack = :rack_name;
                """)
    
    return execute_query(query, {"rack_name": rack_name})

def add_material(part_num, serial_num, long_quantity, operator, ubication, production_date, respuesta):
    flatter_params = (part_num, serial_num, long_quantity, operator, ubication, production_date, respuesta)
    params_list = [item[0]  if isinstance(item, tuple) else item for item in flatter_params]
    params = tuple(params_list)
    result = execute_procedure(StoredProcedures.ADD_MATERIAL, params)
    print(f"Respuesta: {result}")
    return None

def delete_material(serial_num):
    return execute_procedure(StoredProcedures.DELETE_MATERIAL, serial_num)

def massive_delete(part_num):
    return execute_procedure(StoredProcedures.MASSIVE_DELETE, part_num)

def search_older(search):
    query = text("""
                    SELECT m.*, u.nombre_ubicacion, r.nombre_rack
                    FROM materiales m
                    INNER JOIN ubicaciones u ON u.id_ubicacion = m.ubicacion
                    INNER JOIN racks r ON r.id_rack = u.id_rack
                    WHERE r.nombre_rack = :search
                    ORDER BY fecha_produccion ASC LIMIT 1
                 """)
    return execute_query(query, {"search": search})

def move_material(serial_num, new_ubication):
    params = (serial_num, new_ubication)
    return execute_procedure(StoredProcedures.MOVE_MATERIAL, params)

def delete_user(id_user, user_name):
    query = text("""
                 DELETE FROM usuarios
                 WHERE "id" = :id_user AND "user" = :user_name
                 """)
    
    params ={
        "id_user": id_user,
        "user_name": user_name
    }

    return execute_query(query, params)

def update_user(user_id, user_name, user_password, user_rol):
    query = text("""
                    UPDATE usuarios
                    SET "user" = :user_name,
                        "password" = crypt(:user_password, gen_salt('bf')),
                        rol = :user_rol
                    WHERE "id" = :user_id
                 """)
    params = {
        "user_name": user_name,
        "user_password": user_password,
        "user_rol": user_rol,
        "user_id": user_id
    }
    
    return execute_query(query, params)

def search_user(search):
    query = text("""
                    SELECT * 
                    FROM usuarios
                    WHERE "user" LIKE :search OR rol LIKE :search
                """)
    
    return execute_query(query, {"search": f"%{search}%"})

def update_record(user_name, user_role, user_action, user_date, user_time):
    query  = text("""
                  INSERT INTO  registro(usuario, rol, operacion, fecha, hora)
                  VALUES (:user_name, :user_role, :user_action, :user_date, :user_time)
                  """)
    
    params = {
        "user_name": user_name, 
        "user_role" : user_role, 
        "user_action" : user_action, 
        "user_date" : user_date, 
        "user_time" : user_time
    } 
    return execute_query(query, params)
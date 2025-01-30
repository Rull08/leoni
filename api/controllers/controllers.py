from flask import request, jsonify
from services.services import login_user, get_all_materials, set_all_ubications, add_material, search_material, count_ubicactions, get_users
from flask_jwt_extended import create_access_token
#from models.models import User

def login():
    data = request.get_json()
    user_name = data['user_name']
    user_password = data['user_password']
    user_rol = data['user_rol']
    autenticacion = data['autenticacion']
    logged_user = login_user(user_name, user_password, user_rol, autenticacion)
    
    if logged_user and logged_user.autenticacion:
        access_token = create_access_token(identity=logged_user.user_name, additional_claims={"role": logged_user.user_rol})
        return jsonify(access_token=access_token), 200
    else:
        return jsonify({'error': 'Invalid User'}), 401

def get_materials():
    page = request.args.get('page', 1, type=int)
    
    limit = request.args.get('limit', 10)
    if limit.isdigit():  
        limit = int(limit)  
    elif limit.lower() == 'all':
        limit = 'all'
    
    sort_field = request.args.get('sort_field', 'id_material')
    sort_order = request.args.get('sort_order', 'asc')
    
    print(f"Page: {page} limit: {limit} Campo: {sort_field} Order: {sort_order}")
    material, total_items = get_all_materials(page, limit, sort_field, sort_order)
    
    if limit == 'all':
        limit = 1   
                                  
    if material:
        return jsonify({
            "materials":[{
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
                "fecha_entrada": row[10],
            } for row in material],
            "total_items": total_items,
            "total_pages": (total_items + limit - 1) // limit,
            "current_page": page
        }), 200
    return jsonify({'error': 'Products not found'}), 404

def set_get_users():
    page = request.args.get('page', 1, type=int)
    
    limit = request.args.get('limit', 10)
    if limit.isdigit():  
        limit = int(limit)  
    elif limit.lower() == 'all':
        limit = 'all'
    
    sort_field = request.args.get('sort_field', 'id_usuario')
    sort_order = request.args.get('sort_order', 'asc')
    
    print(f"Page: {page} limit: {limit} Campo: {sort_field} Order: {sort_order}")
    users, total_users = get_users(page, limit, sort_field, sort_order)
    
    if limit == 'all':
        limit = 1   
    
    if users:
        return jsonify({
            "users": [{
            "usuario": row[0],
            "contrasena": row[1],
            "id": row[2],
            "rol" :row[3],
        } for row in users],
            "total_users": total_users,
            "total_pages": (total_users + limit - 1) // limit,
            "current_page": page
        }), 200
    return jsonify({'error': 'Users not found'}), 204

def set_search_materials():
    data = request.get_json()
    print("data", data)
    doe = data['obj']
    page = data['page']
    limit = data['limit']
    sort_field = data['sort_field']
    sort_order = data['sort_order']
    material = search_material(doe, page, limit, sort_field, sort_order)
    if material:
        return jsonify([{
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
            "fecha_entrada": row[10],
            } for row in material])
    return jsonify({'error': 'Products not found'}), 204

def set_ubications():
    rack_name = request.args.get('rack_name')
    ubication = set_all_ubications(rack_name)
    count  = count_ubicactions(rack_name)
    print(f"total: {count}")
    print(ubication)
    if ubication:
        material_list = [{
            "id_material": row[0], 
            "clasificacion": row[1], 
            "num_parte": row[2], 
            "num_serie": row[3], 
            "cant_kilos": row[4], 
            "cant_metros": row[5],
            "user": row[6], 
            "ubicacion": row[7], 
            "tipo": row[8], 
            "fecha_produccion": row[9].strftime("%d/%m/%Y") if row[9] else None,
            "fecha_entrada": row[10].strftime("%d/%m/%Y") if row[10] else None,
            "nombre_rack": row[11],
            "nombre_ubicacion": row[12]
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

def add_materials():
    data = request.get_json()
    types = data['types'],
    part_num = data['part_num'],
    serial_num = data['serial_num'],
    weight_quantity = data['weight_quantity'],
    long_quantity = data['long_quantity'],
    operator = data['operator'],
    clasification = data['clasification'],
    ubication = data['ubication'],
    respuesta = data['respuesta']
    print(data)
    result = add_material(types, part_num, serial_num, weight_quantity, long_quantity, operator, clasification, ubication, respuesta)
    return jsonify(result)

def delete_material():
    data = request.get_json()
    print(data)
    result = delete_material(data)
    return jsonify(result)
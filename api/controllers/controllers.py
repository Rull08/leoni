from flask import request, jsonify
from services.services import login_user, get_all_materials, set_all_ubications, add_material, delete_material, search_material
from flask_jwt_extended import create_access_token
from datetime import datetime
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
    material = get_all_materials()
    if material:
        return jsonify([{
            "id_material": row[0], 
            "nombre_clasificacion": row[1], 
            "num_parte": row[2], 
            "numero_serie": row[3], 
            "cant_kilos": row[4], 
            "cant_metros": row[5],
            "user": row[6], 
            "ubicacion": row[7], 
            "tipo": row[8], 
            "fecha_produccion": row[9].strftime("%d/%m/%Y") if row[9] else None
            } for row in material])
    return jsonify({'error': 'Products not found'}), 404

def set_ubications():
    ubication = set_all_ubications()
    print(ubication)
    if ubication:
        return jsonify([{
            "id_material": row[0], 
            "clasificacion": row[1], 
            "num_parte": row[2], 
            "numero_serie": row[3], 
            "cant_kilos": row[4], 
            "cant_metros": row[5],
            "user": row[6], 
            "ubicacion": row[7], 
            "tipo": row[8], 
            "fecha_produccion": row[9].strftime("%d/%m/%Y") if row[9] else None,
            "fecha_entrada": row[10].strftime("%d/%m/%Y") if row[10] else None,
            "nombre_rack": row[11]
            } for row in ubication])
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

def set_search_materials():
    data = request.get_json()
    table = data['table'],
    doe = data['obj']
    material = search_material(table, doe)
    if material:
        return jsonify([{
            "id_material": row[0], 
            "nombre_clasificacion": row[1], 
            "num_parte": row[2], 
            "numero_serie": row[3], 
            "cant_kilos": row[4], 
            "cant_metros": row[5],
            "user": row[6], 
            "ubicacion": row[7], 
            "tipo": row[8], 
            "fecha_produccion": row[9].strftime("%d/%m/%Y") if row[9] else None
            } for row in material])
    return jsonify({'error': 'Products not found'}), 404

#def output_material(product_id):
    result = delete_product(product_id)
    return jsonify(result)



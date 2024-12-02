from flask import request, jsonify
from services.services import login_user, get_all_materials, set_all_ubications, add_material
#from models.models import User

def login():
    data = request.get_json()
    print(data)
    user_name = data['user_name']
    user_password = data['user_password']
    autenticacion = data['autenticacion']
    logged_user = login_user(user_name, user_password, autenticacion)
    if logged_user:
        return jsonify(user_name)
    return jsonify({'error': 'Invalid User'}), 404

def get_materials():
    material = get_all_materials()
    if material:
        return jsonify([{
            "id": row[0], 
            "clasificacion": row[1], 
            "num_parte": row[2], 
            "num_serie": row[3], 
            "cant_kilos": row[4], 
            "cant_metros": row[5],
            "operador": row[6], 
            "ubicacion": row[7], 
            "tipo": row[8], 
            "fecha_produccion": row[9]
            } for row in material])
    return jsonify({'error': 'Products not found'}), 404

def set_ubications():
    ubication = set_all_ubications()
    if ubication:
        return jsonify([{
            "estado": row[1],
            "columna": row[2],
            "fila": row[3]
            } for row in ubication])
    return jsonify({'error': 'Ubications not found'}), 404

def add_material():
    data = request.get_json()
    part_num = data['part_num'],
    serial_num = data['serial_num'],
    weight_quantity = data['weight_quantity'],
    long_quantity = data['long_quantity'],
    operator = data['operator'],
    clasification = data['clasification'],
    type = data['type'],
    ubication = data['ubication'],
    production_date = data['production_date']
    result = add_material(part_num, serial_num, weight_quantity, long_quantity, operator, clasification, type, ubication, production_date)
    return jsonify(result)

#def modify_material(product_id):
    data = request.json
    name = data.get('name')
    quantity = data.get('quantity')
    price = data.get('price')
    result = update_product(product_id, name, quantity, price)
    return jsonify(result)

#def output_material(product_id):
    result = delete_product(product_id)
    return jsonify(result)



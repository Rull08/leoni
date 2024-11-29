from flask import request, jsonify
from services.services import login_user, get_all_materials, add_product, update_product, delete_product, get_product
#from models.models import User

def login():
    data = request.get_json()
    print(data)
    user_name = data['user_name']
    user_password = data['user_password']
    autenticacion = data['autenticacion']
    logged_user = login_user(user_name, user_password, autenticacion)
    print(logged_user)
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

def create_product():
    data = request.json
    name = data.get('name')
    quantity = data.get('quantity')
    price = data.get('price')
    result = add_product(name, quantity, price)
    return jsonify(result)

def modify_product(product_id):
    data = request.json
    name = data.get('name')
    quantity = data.get('quantity')
    price = data.get('price')
    result = update_product(product_id, name, quantity, price)
    return jsonify(result)

def remove_product(product_id):
    result = delete_product(product_id)
    return jsonify(result)



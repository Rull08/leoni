from flask import request, jsonify
from services.services import login_user, add_product, update_product, delete_product, get_product
from models.models import User

def login():
    print('Simon')
    data = request.get_json()
    user_name = data.get('user_name')
    user_password = data.get('user_password')
    autenticacion = data.get('autenticacion')
    #if not user_name or not user_password or not autenticacion:
    #    return jsonify({"error": "Faltal parámetros: 'Usuario' o 'Contraseña'"}), 400
    logged_user = login_user(user_name, user_password, autenticacion)
    if logged_user:
        return jsonify(user_name.__dict__)
    return jsonify({'error': 'Invalid User'}), 404

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

def fetch_product(product_id):
    product = get_product(product_id)
    if product:
        return jsonify(product.__dict__)  # Devolver el dict del objeto Product
    return jsonify({'error': 'Product not found'}), 404

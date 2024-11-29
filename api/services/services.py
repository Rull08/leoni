from config import StoredProcedures
from database import execute_procedure, execute_query
from models.models import Login

def login_user(user_name, user_password, autenticacion):
    params = (user_name, user_password, autenticacion)
    result = execute_procedure(StoredProcedures.LOGIN_USER, params)
    if result:
        return Login(user_name, user_password, autenticacion)
    return None

def get_all_materials():
    query = "SELECT * FROM inventario"
    return execute_query(query)

def add_product(name, quantity, price):
    params = (name, quantity, price)
    return execute_query(StoredProcedures.ADD_PRODUCT, params)

def update_product(product_id, name, quantity, price):
    params = (product_id, name, quantity, price)
    return execute_query(StoredProcedures.UPDATE_PRODUCT, params)

def delete_product(product_id):
    params = (product_id,)
    return execute_query(StoredProcedures.DELETE_PRODUCT, params)

def get_product(product_id):
    params = (product_id,)
    #result = execute_query(StoredProcedures.GET_PRODUCT, params)
    #if result:
    #    return Product(*result[0])  # Asumiendo que result[0] devuelve una tupla con los datos del producto
    #return None
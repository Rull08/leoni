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
    #query = f"SELECT * FROM {StoredProcedures.GET_MATERIAL}()"
    return execute_query(query)

def set_all_ubications():
    query = "SELECT * FROM ubicaciones"
    return execute_query(query)

def add_material(clasification, part_num, serial_num, weight_quantity, long_quantity, operator, ubication, types):
    params = (clasification, part_num, serial_num, weight_quantity, long_quantity, operator, ubication, types)
    print(params)
    return execute_procedure(StoredProcedures.ADD_MATERIAL, params)

def update_product(product_id, name, quantity, price):
    params = (product_id, name, quantity, price)
    return execute_procedure(StoredProcedures.UPDATE_PRODUCT, params)

def delete_product(product_id):
    params = (product_id,)
    return execute_procedure(StoredProcedures.DELETE_PRODUCT, params)
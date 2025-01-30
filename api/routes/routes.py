from flask import Blueprint, request
from controllers.controllers import login, get_materials, set_ubications, add_materials, delete_material, set_search_materials, set_get_users
routes_bp = Blueprint('routes', __name__)

routes_bp.route('/login', methods=['POST'])(login)
routes_bp.route('/entry', methods=['POST'])(add_materials) 
routes_bp.route('/search', methods=['POST'])(set_search_materials)

routes_bp.route('/ubications', methods=['GET'])(set_ubications)
routes_bp.route('/users', methods=['GET'])(set_get_users)
routes_bp.route('/materials', methods=['GET'])(get_materials)
    
routes_bp.route('/output', methods=['DELETE'])(delete_material)

#routes_bp.route('/delete_material', methods=['DELETE'])(delete_material)
#routes_bp.route('/material/<int:material_id>', methods=['PUT'])(modify_product)
#routes_bp.route('/material/<int:material_id>', methods=['DELETE'])(remove_product)

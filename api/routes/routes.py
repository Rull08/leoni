   # routes/inventory_routes.py

from flask import Blueprint
from controllers.controllers import login, create_product, modify_product, remove_product, fetch_product

routes_bp = Blueprint('routes', __name__)

routes_bp.route('/login', methods=['POST'])(login)
routes_bp.route('/material', methods=['POST'])(create_product)
routes_bp.route('/material/<int:material_id>', methods=['PUT'])(modify_product)
routes_bp.route('/material/<int:material_id>', methods=['DELETE'])(remove_product)
routes_bp.route('/material/<int:material_id>', methods=['GET'])(fetch_product)

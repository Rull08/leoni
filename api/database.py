from config import DB_CONFIG
from sqlalchemy import text


import logging
from db_pool import get_connection

def execute_procedure(procedure_name, params=None):
    conn = get_connection()
    try:
        with conn.begin():
            if params:
                # Si params es una lista, conviértela a tupla.
                if isinstance(params, list):
                    params = tuple(params)
                # Crear un diccionario con claves p1, p2, ... para cada parámetro.
                params_dict = {f"p{i+1}": param for i, param in enumerate(params)}
                # Crear los placeholders nombrados, por ejemplo: ":p1, :p2, :p3, :p4"
                placeholders = ",".join([f":p{i+1}" for i in range(len(params))])
                query_str = f"CALL {procedure_name}({placeholders})"
                logging.info("Parámetros: %s", params_dict)
                logging.info("Query construida: %s", query_str)
            else:
                query_str = f"CALL {procedure_name}()"
                params_dict = {}
            
            logging.info("Ejecutando procedimiento: %s", query_str)
            
            # Convertir la cadena en un objeto ejecutable text.
            stmt = text(query_str)
            # Ejecutar la consulta pasando el diccionario de parámetros.
            result = conn.execute(stmt, params_dict)
            logging.info("Resultado: %s", result)
            
            # Obtener los datos si la consulta retorna filas.
            data = result.fetchall() if result.returns_rows else None
            return data
    except Exception as e:
        logging.error("Error executing procedure %s: %s", procedure_name, e, exc_info=True)
        raise
    finally:
        conn.close()
        
def execute_query(query, params=None):
    conn = get_connection()
    try:
        with conn.begin():
            result = conn.execute(query, params or ())
            
            logging.info("Ejecutando query: %s - Params %s", query, params)
            data = result.fetchall() if result.returns_rows else None
            return data
    except Exception as e:
        logging.error("Error executing query: %s", e, exc_info=True)
        raise
    finally:
        conn.close()

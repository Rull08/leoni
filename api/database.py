import pg8000
from config import DB_CONFIG

def get_connection():
    try:
        return pg8000.connect(
            host=DB_CONFIG["host"],
            port=DB_CONFIG["port"],
            database=DB_CONFIG["database"],
            user=DB_CONFIG["user"],
            password=DB_CONFIG["password"]
        )
    except Exception as e:
        print(f"Error al conectar a la base de datos: {e}")
        raise

def execute_query(procedure_name, params):
    conn = None
    try:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute(f"CALL {procedure_name}({', '.join(['%s'] * len(params))})", params)
        result = cursor.fetchall() if cursor.description else None
        conn.commit()
        return result
    except Exception as e:
        print(f"Error executing query: {e}")
        raise
    finally:
        cursor.close()
        conn.close()

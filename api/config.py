import os
from dotenv import load_dotenv

# Cargar las variables desde el archivo .env
load_dotenv()

#Configuracion de la base de datos
DB_CONFIG = {
    "host": os.getenv("DB_HOST"),
    "port": int(os.getenv("DB_PORT", 5432)),  # Valor por defecto 5432
    "database": os.getenv("DB_NAME"),
    "user": os.getenv("DB_USER"),
    "password": os.getenv("DB_PASSWORD"),
}

#Procedimientos almacenados
class StoredProcedures:
    ADD_MATERIAL = os.getenv('ADD_MATERIAL')
    GET_MATERIAL = os.getenv('GET_MATERIAL')
    UPDATE_MATERIAL = os.getenv('UPDATE_MATERIAL')
    DELETE_MATERIAL = os.getenv('DELETE_MATERIAL')
    LOGIN_MATERIAL = os.getenv('LOGIN_USER')
    
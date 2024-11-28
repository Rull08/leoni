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
    ADD_PRODUCT = os.getenv('ADD_PRODUCT')
    GET_PRODUCT = os.getenv('GET_PRODUCT')
    UPDATE_PRODUCT = os.getenv('UPDATE_PRODUCT')
    DELETE_PRODUCT = os.getenv('DELETE_PRODUCT')
    LOGIN_USER = os.getenv('LOGIN_USER')
    
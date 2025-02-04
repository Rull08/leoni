from sqlalchemy  import create_engine
from config import DB_CONFIG

DATABASE_URL = f"postgresql+pg8000://{DB_CONFIG['user']}:{DB_CONFIG['password']}@{DB_CONFIG['host']}:{DB_CONFIG['port']}/{DB_CONFIG['database']}"

engine = create_engine(DATABASE_URL, pool_size=100, max_overflow=100)

def get_connection():
    try:
        return engine.connect()
    except Exception as e:
        print(f"Error al conectar: {e}")
        raise
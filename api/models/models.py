class Login:
    def __init__(self, user_name, user_password, user_rol, autenticacion):
        self.user_name = user_name
        self.user_password = user_password
        self.user_rol = user_rol
        self.autenticacion = autenticacion
        
    def __repr__(self):
        masked_password = '*' * len(self.user_password)
        return f"<User(user_name={self.user_name}, user_password={masked_password}, user_role={self.user_rol}, autenticacion={self.autenticacion})>"
    
class Material:
    def __init__(self, types, part_num, serial_num, weight_quantity, long_quantity, operator, ubication, clasification, respuesta):
        self.types = types,
        self.part_num = part_num,
        self.serial_num = serial_num,
        self.weight_quantity = weight_quantity,
        self.long_quantity = long_quantity,
        self.operator = operator,
        self.clasification = clasification,
        self.ubication = ubication,
        self.respuesta = respuesta
        
    def __repr__(self):
        return f"<Material(types={self.types}, part_num={self.part_num}, serial_num={self.serial_num}, weight_quantity={self.weight_quantity}, long_quantity={self.long_quantity}, operator={self.operator}, clasification={self.clasification},  ubication={self.ubication}, respuesta={self.respuesta})>"
    
class Ubicatios:
    def __init__(self, colum, state, row):
        self.colum = colum, 
        self.state = state,
        self.row = row
    
    def __repr__(self):
        return f"<Ubication(colum={self.colum}, state={self.state}, row={self.row})>"
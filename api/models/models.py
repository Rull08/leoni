class Login:
    def __init__(self, user_name, user_password, autenticacion):
        self.user_name = user_name
        self.user_password = user_password
        self.autenticacion = autenticacion
        
    def __repr__(self):
        masked_password = '*' * len(self.user_password)
        return f"<User(user_name={self.user_name}, user_password={masked_password}, autenticacion={self.autenticacion})>"
    
class Material:
    def __init__(self, part_num, serial_num, weight_quantity, long_quantity, operator, clasification, type, ubication, production_date):
        self.part_num = part_num,
        self.serial_num = serial_num,
        self.weight_quantity = weight_quantity,
        self.long_quantity = long_quantity,
        self.operator = operator,
        self.clasification = clasification,
        self.type = type,
        self.ubication = ubication,
        self.production_date = production_date
        
    def __repr__(self):
        return f"<Material(part_num={self.part_num}, serial_num={self.serial_num}, weight_quantity={self.weight_quantity}, long_quantity={self.long_quantity}, operator={self.operator}, clasification={self.clasification}, type={self.type}, ubication={self.ubication}, production_date={self.production_date})>"
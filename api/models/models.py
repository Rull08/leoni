class User:
    def __init__(self, user_name, user_password, autenticacion):
        self.user_name = user_name
        self.user_password = user_password
        self.autenticacion = autenticacion
        
    def __repr__(self):
        masked_password = '*' * len(self.user_password)
        return f"<User(user_name={self.user_name}, user_password={masked_password}, autenticacion={self.autenticacion})>"
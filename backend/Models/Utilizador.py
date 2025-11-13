from extensions import bcrypt
from filePaths import users


class Utilizador:
    def __init__(self, nome, email, password, perfil="Comum"):
        self.id = len(users) + 1
        self.nome = nome
        self.email = email
        self.password = bcrypt.generate_password_hash(password).decode("utf-8")
        self.perfil = perfil

    def to_dict(self):
        return {
            "id": self.id,
            "nome": self.nome,
            "email": self.email,
            "password": self.password,
            "perfil": self.perfil,
        }

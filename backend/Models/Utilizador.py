class Utilizador:
    def __init__(self, id, nome, email, password, perfil="Comum"):
        self.id = id
        self.nome = nome
        self.email = email
        self.password = password
        self.perfil = perfil

    def to_dict(self):
        return {
            "id": self.id,
            "nome": self.nome,
            "email": self.email,
            "password": self.password,
            "perfil": self.perfil,
        }

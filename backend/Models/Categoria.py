from filePaths import ct


class Categoria:
    def __init__(self, nome, descricao):
        self.id = len(ct) + 1
        self.nome = nome
        self.descricao = descricao

    def to_dict(self):
        return {
            "id": self.id,
            "nome": self.nome,
            "descricao": self.descricao,
        }

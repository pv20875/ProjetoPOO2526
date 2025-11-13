from filePaths import tr


class Transacao:
    def __init__(self, descricao, valor, data, categoria, tipo, utilizadorId):
        self.id = len(tr) + 1
        self.descricao = descricao
        self.valor = valor
        self.data = data
        self.categoria = categoria
        self.tipo = tipo
        self.utilizadorId = utilizadorId

    def to_dict(self):
        return {
            "id": self.id,
            "descricao": self.descricao,
            "valor": self.valor,
            "data": self.data,
            "categoria": self.categoria,
            "tipo": self.tipo,
            "utilizadorId": self.utilizadorId,
        }

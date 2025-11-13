from filePaths import tr


class Relatorios:
    def __init__(self, user_id):
        self.utilizador_id = user_id
        # transações do utilizador autenticado
        self.transacoes = [t for t in tr if t["utilizadorId"] == user_id]

    def total_receitas(self):
        # somar as receitas
        return sum(t["valor"] for t in self.transacoes if t["tipo"] == "Receita")

    def total_despesas(self):
        # somar as despesas
        return sum(t["valor"] for t in self.transacoes if t["tipo"] == "Despesa")

    def saldo_atual(self):
        # saldo = receitas - despesas
        return self.total_receitas() - self.total_despesas()

    def transacoes_por_categoria(self):
        # somar total por categoria
        categorias = {}
        for t in self.transacoes:
            cat = t["categoria"]
            categorias[cat] = categorias.get(cat, 0) + t["valor"]
        return categorias

    def to_dict(self):
        return {
            "total_receitas": self.total_receitas(),
            "total_despesas": self.total_despesas(),
            "saldo_atual": self.saldo_atual(),
            "por_categoria": self.transacoes_por_categoria(),
        }

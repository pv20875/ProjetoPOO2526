from file_paths import tr


class Relatorios:
    def __init__(self, user_id):
        # se não houver um "id" válido
        if user_id is None:
            self.transacoes = tr  # todas as transações
        else:
            self.transacoes = [
                t for t in tr if t["utilizadorId"] == user_id
            ]  # transações filtradas

    def total_receitas(self):
        # somar as receitas
        return sum(t["valor"] for t in self.transacoes if t["tipo"] == "Receita")

    def total_despesas(self):
        # somar as despesas
        return sum(t["valor"] for t in self.transacoes if t["tipo"] == "Despesa")

    def saldo_atual(self):
        # saldo = receitas - despesas
        return self.total_receitas() - self.total_despesas()

    def to_dict(self):
        return {
            "total_receitas": self.total_receitas(),
            "total_despesas": self.total_despesas(),
            "saldo_atual": self.saldo_atual(),
        }

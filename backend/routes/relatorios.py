import json
from datetime import datetime
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.Relatorios import Relatorios

relatorios_bp = Blueprint("relatorios_bp", __name__)


# Relatórios (Receitas, Despesas e Saldo Atual)
@relatorios_bp.route("/relatorios", methods=["GET"])
@jwt_required()
def relatorios():
    identity = json.loads(get_jwt_identity())
    user_id, perfil = identity.get("id"), identity.get("perfil")

    # se o utilizador autenticado for o Administrador, vê todos os relatórios
    # caso não seja, filtra apenas as do utilizador autenticado
    if perfil == "Administrador":
        relatorios = Relatorios(None)
    else:
        relatorios = Relatorios(user_id)

    # obter lista inicial das transações
    transacoes = relatorios.transacoes

    # datas/filtros opcionais em formato ISO
    start = request.args.get("start_date")
    end = request.args.get("end_date")

    # filtrar a partir da data inicial
    if start:
        # converter data para objeto datetime
        start = datetime.fromisoformat(start)
        # manter as transações cujo campo "data" seja igual ou superior
        transacoes = [
            t for t in transacoes if datetime.fromisoformat(t["data"]) >= start
        ]

    # filtrar até à data final
    if end:
        end = datetime.fromisoformat(end)
        # manter apenas as transações anteriores ou iguais à data final
        transacoes = [t for t in transacoes if datetime.fromisoformat(t["data"]) <= end]

    # aplicar as transações filtradas ao objeto "Relatorios"
    relatorios.transacoes = transacoes

    return (
        jsonify(
            {
                "relatorios": {
                    "receitas": relatorios.total_receitas(),
                    "despesas": relatorios.total_despesas(),
                    "saldo": relatorios.saldo_atual(),
                },
            }
        ),
        200,
    )

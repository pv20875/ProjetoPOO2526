import json
import uuid
from datetime import datetime
from flask import Blueprint, request, jsonify
from flask_jwt_extended import (
    jwt_required,
    get_jwt_identity,
)
from models.Transacao import Transacao
from file_paths import tr, save_tr, ct

transacoes_bp = Blueprint("transacoes_bp", __name__)


# Listagem das transações
@transacoes_bp.route("/transacoes/list", methods=["GET"])
@jwt_required()
def list_transactions():
    identity = json.loads(get_jwt_identity())
    user_id, perfil = identity.get("id"), identity.get("perfil")

    # obter categoria opcional
    categoria = request.args.get("categoria")

    return (
        jsonify(
            [
                t
                for t in tr
                # filtrar transações por utilizador (id e perfil):
                # se for Administrador, incluir todas
                # caso não, incluir apenas as transações do próprio utilizador
                if perfil == "Administrador" or t["utilizadorId"] == user_id
                # filtrar transações por categoria:
                # se não for fornecida nenhuma categoria, incluir todas
                # caso for, incluir apenas as transações que têm categoria válida
                if not categoria or t["categoria"] == categoria
            ]
        ),
        200,
    )


# Obter por id
@transacoes_bp.route("/transacoes/transacao/<int:tr_id>", methods=["GET"])
@jwt_required()
def fetchById_transaction(tr_id):
    # obter a transação selecionada através do id
    transacao = next((t for t in tr if t["id"] == tr_id), None)

    if not transacao:
        return jsonify({"error": "Transação não encontrada!"}), 404

    return jsonify(transacao), 200


# Criar
@transacoes_bp.route("/transacoes/create", methods=["POST"])
@jwt_required()
def create_transaction():
    user_id = json.loads(get_jwt_identity()).get("id")

    data = request.get_json() or {}
    descricao, valor, date, categoria, tipo = (
        data.get("descricao"),
        data.get("valor"),
        data.get("data"),
        data.get("categoria"),
        data.get("tipo"),
    )

    # se os campos estiverem vazios
    if not all([descricao, valor, date, categoria, tipo]):
        return jsonify({"error": "Não podem existir campos vazios!"}), 400

    # se o valor for negativo
    if valor <= 0:
        return jsonify({"error": "O valor não pode ser negativo!"}), 400

    # se a data não tiver o formato correto
    try:
        datetime.fromisoformat(date)
    except ValueError:
        return jsonify({"error": "A data tem de estar no formato YYYY-MM-DD!"}), 400

    # se a categoria introduzida não existir
    if categoria not in [c["nome"] for c in ct]:
        return jsonify({"error": "A categoria introduzida não existe!"}), 400

    # se o tipo introduzido não existir (tem de ser Receita ou Despesa)
    if tipo not in ["Receita", "Despesa"]:
        return jsonify({"error": "O tipo introduzido não existe!"}), 400

    transacao = Transacao(
        id=str(uuid.uuid4()),
        descricao=descricao,
        valor=valor,
        data=date,
        categoria=categoria,
        tipo=tipo,
        utilizadorId=user_id,
    )

    tr.append(transacao.to_dict())
    save_tr(tr)

    return jsonify({"msg": "Transação registada com sucesso!"}), 201


# Editar
@transacoes_bp.route("/transacoes/update/<int:tr_id>", methods=["PATCH"])
@jwt_required()
def update_transacao(tr_id):
    identity = json.loads(get_jwt_identity())
    user_id, perfil = identity.get("id"), identity.get("perfil")

    transacao = next((t for t in tr if t["id"] == tr_id), None)

    data = request.get_json() or {}
    descricao, valor, date, categoria, tipo = (
        data.get("descricao"),
        data.get("valor"),
        data.get("data"),
        data.get("categoria"),
        data.get("tipo"),
    )

    # se a transação não existir
    if not transacao:
        return jsonify({"error": "Transação não encontrada!"}), 404

    # se a transação não for do utilizador que a criou ou se o mesmo não for o Administrador
    if transacao["utilizadorId"] != user_id or perfil != "Administrador":
        return (
            jsonify({"error": "Não tem permissão para atualizar esta transação!"}),
            403,
        )

    if not all([descricao, valor, date, categoria, tipo]):
        return jsonify({"error": "Não podem existir campos vazios!"}), 400

    if valor <= 0:
        return jsonify({"error": "O valor não pode ser nulo ou negativo!"}), 400

    try:
        datetime.fromisoformat(date)
    except ValueError:
        return jsonify({"error": "A data tem de estar no formato YYYY-MM-DD!"}), 400

    if categoria not in [c["nome"] for c in ct]:
        return jsonify({"error": "A categoria introduzida não existe!"}), 400

    if tipo not in ["Receita", "Despesa"]:
        return jsonify({"error": "O tipo introduzido não existe!"}), 400

    transacao.update(
        {
            "descricao": descricao,
            "valor": valor,
            "data": date,
            "categoria": categoria,
            "tipo": tipo,
        }
    )

    # atualizar transação na memória e no ficheiro
    save_tr(tr)

    return jsonify({"msg": "Transação atualizada com sucesso!"}), 200


# Apagar
@transacoes_bp.route("/transacoes/delete/<int:tr_id>", methods=["DELETE"])
@jwt_required()
def delete_transaction(tr_id):
    identity = json.loads(get_jwt_identity())
    user_id, perfil = identity.get("id"), identity.get("perfil")

    transacao = next((t for t in tr if t["id"] == tr_id), None)

    if not transacao:
        return jsonify({"error": "Transação não encontrada!"}), 404

    if transacao["utilizadorId"] != user_id and perfil != "Administrador":
        return jsonify({"error": "Não tem permissão para apagar esta transação!"}), 403

    # remover transação da memória e do ficheiro
    tr.remove(transacao)
    save_tr(tr)

    return jsonify({"msg": "Transação apagada com sucesso!"}), 200

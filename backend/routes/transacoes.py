from flask import Blueprint, request, jsonify
from flask_jwt_extended import (
    jwt_required,
    get_jwt_identity,
)
from datetime import datetime
from Models.Transacao import Transacao
from filePaths import tr, save_tr, ct

tr_bp = Blueprint("tr", __name__)


def is_valid_date(date_str: str) -> bool:
    try:
        datetime.strptime(date_str, "%Y-%m-%d")
        return True
    except ValueError:
        return False


# Listagem
@tr_bp.route("/transacoes/list", methods=["GET"])
@jwt_required()
def list_tr():
    # obter o ID do utilizador autenticado (vem do token JWT)
    user_id = int(get_jwt_identity())

    # filtrar apenas as transações criadas por este utilizador
    user_tr = [t for t in tr if t["utilizadorId"] == user_id]
    return jsonify(user_tr), 200


# Obter por id
@tr_bp.route("/transacoes/transacao/<int:tr_id>", methods=["GET"])
@jwt_required()
def fetchById_transacao(tr_id):
    transacao = next((t for t in tr if t["id"] == tr_id), None)

    if not transacao:
        return jsonify({"error": "Transação não encontrada!"}), 404

    return jsonify(transacao), 200


# Criar
@tr_bp.route("/transacoes/create", methods=["POST"])
@jwt_required()
def create_tr():
    user_id = int(get_jwt_identity())
    data = request.get_json()
    descricao = data.get("descricao")
    valor = data.get("valor")
    date = data.get("data")
    categoria = data.get("categoria")
    tipo = data.get("tipo")

    # se os campos estiverem vazios
    if not descricao or not valor or not date or not categoria or not tipo:
        return jsonify({"error": "Não podem existir campos vazios!"}), 400

    # se o valor for negativo
    if valor <= 0:
        return jsonify({"error": "O valor não pode ser negativo!"}), 400

    # se a data não tiver o formato correto
    if not is_valid_date(date):
        return jsonify({"error": "A data tem de estar no formato YYYY-MM-DD!"}), 400

    # se a categoria introduzida não existir
    if categoria not in [c["nome"] for c in ct]:
        return jsonify({"error": "A categoria introduzida não existe!"}), 400

    # se o tipo introduzido não existir (tem de ser Receita ou Despesa)
    if tipo not in ["Receita", "Despesa"]:
        return jsonify({"error": "O tipo introduzido não existe!"}), 400

    # criar a transação
    tr_data = Transacao(
        descricao=descricao,
        valor=valor,
        data=date,
        categoria=categoria,
        tipo=tipo,
        utilizadorId=user_id,
    )
    # salvar os dados da transação para o ficheiro
    tr.append(tr_data.to_dict())
    save_tr(tr)

    return jsonify({"msg": "Transação registada com sucesso!"}), 201


# Editar
@tr_bp.route("/transacoes/update/<int:tr_id>", methods=["PATCH"])
@jwt_required()
def update_transacao(tr_id):
    user_id = int(get_jwt_identity())
    # procurar a transação com o ID especificado
    transacao = next((t for t in tr if t["id"] == tr_id), None)

    data = request.get_json()
    descricao = data.get("descricao")
    valor = data.get("valor")
    date = data.get("data")
    categoria = data.get("categoria")
    tipo = data.get("tipo")

    # se a transação não existir
    if not transacao:
        return jsonify({"error": "Transação não encontrada!"}), 404

    # garantir que pertence ao utilizador autenticado
    if transacao["utilizadorId"] != user_id:
        return (
            jsonify({"error": "Não tem permissão para atualizar esta transação!"}),
            403,
        )

    if not descricao or not valor or not date or not categoria or not tipo:
        return jsonify({"error": "Não podem existir campos vazios!"}), 400

    if valor <= 0:
        return jsonify({"error": "O valor não pode ser nulo ou negativo!"}), 400

    if not is_valid_date(date):
        return jsonify({"error": "A data tem de estar no formato YYYY-MM-DD!"}), 400

    if categoria not in [c["nome"] for c in ct]:
        return jsonify({"error": "A categoria introduzida não existe!"}), 400

    if tipo not in ["Receita", "Despesa"]:
        return jsonify({"error": "O tipo introduzido não existe!"}), 400

    # atualizar transação
    transacao.update(
        {
            "descricao": descricao,
            "valor": valor,
            "data": date,
            "categoria": categoria,
            "tipo": tipo,
        }
    )
    # salvar os dados atualizados da transação para o ficheiro
    save_tr(tr)

    return jsonify({"msg": "Transação atualizada com sucesso!"}), 200


# Apagar
@tr_bp.route("/transacoes/delete/<int:tr_id>", methods=["DELETE"])
@jwt_required()
def delete_transacao(tr_id):
    user_id = int(get_jwt_identity())
    transacao = next((t for t in tr if t["id"] == tr_id), None)

    if not transacao:
        return jsonify({"error": "Transação não encontrada!"}), 404

    if transacao["utilizadorId"] != user_id:
        return jsonify({"error": "Não tem permissão para apagar esta transação!"}), 403

    # remover a transação do ficheiro
    tr.remove(transacao)
    save_tr(tr)

    return jsonify({"msg": "Transação apagada com sucesso!"}), 200

from flask import Blueprint, request, jsonify
from flask_jwt_extended import (
    jwt_required,
)
from Models.Categoria import Categoria
from filePaths import ct, save_ct

ct_bp = Blueprint("ct", __name__)


# Listagem
@ct_bp.route("/categorias/list", methods=["GET"])
@jwt_required()
def list_ct():
    return jsonify(ct), 200


# Criar
@ct_bp.route("/categorias/create", methods=["POST"])
@jwt_required()
def create_ct():
    data = request.get_json()
    nome = data.get("nome")
    descricao = data.get("descricao")

    if not nome or not descricao:
        return jsonify({"error": "Não podem existir campos vazios!"}), 400

    # se o nome da categoria já existir
    if nome in [c["nome"] for c in ct]:
        return jsonify({"error": "A categoria introduzida já existe!"}), 400

    ct_data = Categoria(
        nome=nome,
        descricao=descricao,
    )

    ct.append(ct_data.to_dict())
    save_ct(ct)

    return jsonify({"msg": "Categoria registada com sucesso!"}), 201

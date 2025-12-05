import uuid
from flask import Blueprint, request, jsonify
from flask_jwt_extended import (
    jwt_required,
)
from models.Categoria import Categoria
from file_paths import ct, save_ct

categorias_bp = Blueprint("categorias_bp", __name__)


# Listagem das categorias
@categorias_bp.route("/categorias/list", methods=["GET"])
@jwt_required()
def list_categories():
    # retornar todas as categorias guardadas no ficheiro
    return jsonify(ct), 200


# Criar
@categorias_bp.route("/categorias/create", methods=["POST"])
@jwt_required()
def create_category():
    data = request.get_json()
    nome, descricao = data.get("nome"), data.get("descricao")

    if not nome or not descricao:
        return jsonify({"error": "Não podem existir campos vazios!"}), 400

    # se o nome da categoria já existir
    if nome in [c["nome"] for c in ct]:
        return jsonify({"error": "A categoria introduzida já existe!"}), 400

    categoria = Categoria(
        id=str(uuid.uuid4()),
        nome=nome,
        descricao=descricao,
    )

    ct.append(categoria.to_dict())
    save_ct(ct)

    return jsonify({"msg": "Categoria registada com sucesso!"}), 201

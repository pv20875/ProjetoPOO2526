import uuid
import json
from flask import Blueprint, request, jsonify
from flask_jwt_extended import (
    create_access_token,
    jwt_required,
    get_jwt_identity,
    set_access_cookies,
    unset_jwt_cookies,
)
from models.Utilizador import Utilizador
from file_paths import users, save_users
from extensions import bcrypt

# criar blueprint/rota
auth_bp = Blueprint("auth_bp", __name__)


# Criar conta
@auth_bp.route("/signup", methods=["POST"])
def signup():
    # obter os dados enviados pelo cliente em formato JSON
    # caso não houver um formato JSON válido, usar um dicionário vazio para evitar erros
    data = request.get_json() or {}
    # extrair os campos do utilizador
    nome, email, password = data.get("nome"), data.get("email"), data.get("password")

    # se os campos nome, email e password estiverem vazios
    if not all([nome, email, password]):
        return jsonify({"error": "Não podem existir campos vazios!"}), 400

    # se já existir uma conta com o mesmo email introduzido
    if any(u["email"] == email for u in users):
        return jsonify({"error": "Já existe uma conta com esse email!"}), 400

    # criar uma instância do utilizador
    user = Utilizador(
        id=str(uuid.uuid4()),
        nome=nome,
        email=email,
        password=bcrypt.generate_password_hash(password).decode("utf-8"),
    )
    # adicionar o novo utilizador à lista em memória e guardar no ficheiro
    users.append(user.to_dict())
    save_users(users)

    return jsonify({"msg": "Conta registada com sucesso!"}), 201


# Autenticação
@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json() or {}
    email, password = data.get("email"), data.get("password")

    # encontrar o utilizador na lista através do email
    user = next((u for u in users if u["email"] == email), None)

    # validar as credenciais
    if not user or not bcrypt.check_password_hash(user["password"], password):
        return jsonify({"error": "Credenciais inválidas!"}), 401

    # criar o token de acesso JWT com os dados do utilizador
    access_token = create_access_token(identity=json.dumps(user))

    # criar resposta e definir cookie do JWT
    response = jsonify({"msg": "Autenticado com sucesso!"})
    set_access_cookies(response, access_token)

    return response, 200


# Desautenticação
@auth_bp.route("/logout", methods=["POST"])
def logout():
    # remover o token do cookie
    response = jsonify({"msg": "Desautenticado com sucesso!"})
    unset_jwt_cookies(response)
    return response, 200


# Utilizador autenticado
@auth_bp.route("/auth/me", methods=["GET"])
@jwt_required()  # requer uma autenticação válida
def me():
    # retornar todos os dados do utilizador
    return jsonify(json.loads(get_jwt_identity())), 200


# Listagem dos utilizadores
@auth_bp.route("/auth/list", methods=["GET"])
@jwt_required()
def list_users():
    # obter o campo "perfil" do token do utilizador autenticado
    perfil = json.loads(get_jwt_identity()).get("perfil")

    # verificar se o utilizador autenticado é o administrador
    if perfil != "Administrador":
        return jsonify({"error": "Acesso apenas para Administradores!"}), 403

    # remover as palavras-passe antes de listar os utilizadores
    list = [{k: v for k, v in u.items() if k != "password"} for u in users]
    return jsonify(list), 200

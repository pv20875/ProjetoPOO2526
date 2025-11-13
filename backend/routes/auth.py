from flask import Blueprint, request, jsonify
from flask_jwt_extended import (
    create_access_token,
    jwt_required,
    get_jwt_identity,
    set_access_cookies,
    unset_jwt_cookies,
)
from Models.Utilizador import Utilizador
from filePaths import users, save_users
from extensions import bcrypt

# criar blueprint
auth = Blueprint("auth", __name__)


# Criar conta
@auth.route("/signup", methods=["POST"])
def signup():
    data = request.get_json()
    nome = data.get("nome")
    email = data.get("email")
    password = data.get("password")

    # se os campos nome, email e/ou password estiverem vazios
    if not nome or not email or not password:
        return jsonify({"error": "Não podem existir campos vazios!"}), 400

    # se já existir uma conta com o mesmo email introduzido
    if any(u["email"] == email for u in users):
        return jsonify({"error": "Já existe uma conta com esse email!"}), 400

    # criar o utilizador
    user = Utilizador(
        nome=nome,
        email=email,
        password=password,
    )
    # salvar os dados do utilizador para o ficheiro
    users.append(user.to_dict())
    save_users(users)

    return jsonify({"msg": "Conta registada com sucesso!"}), 201


# Autenticação
@auth.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    # encontrar o utilizador na lista através do email
    user = next((u for u in users if u["email"] == email), None)

    # se o utilizador não for encontrado e/ou a palara-passe não coincidir
    if not user or not bcrypt.check_password_hash(user["password"], password):
        return jsonify({"error": "Credenciais inválidas!"}), 401

    # criar o token de autenticação usando o id como identidade
    access_token = create_access_token(identity=str(user["id"]))
    response = jsonify({"msg": "Autenticado com sucesso!"})

    # adicionar o cookie (com o token) no response
    set_access_cookies(response, access_token)

    return response, 200


# Desautenticação
@auth.route("/logout", methods=["POST"])
def logout():
    # remover o token do cookie
    response = jsonify({"msg": "Desautenticado com sucesso!"})
    unset_jwt_cookies(response)
    return response, 200


# Utilizador autenticado
@auth.route("/auth/me", methods=["GET"])
@jwt_required()  # requer autenticação
def me():
    # identidade (sendo este o id)
    current_id = int(get_jwt_identity())
    user = next((u for u in users if u["id"] == current_id), None)
    # se o utilizador não for encontrado
    if not user:
        return jsonify({"error": "Utilizador não encontrado..."}), 404
    return jsonify(user), 200


# Listagem dos utilizadores
@auth.route("/auth/list", methods=["GET"])
@jwt_required()
def list_users():
    # remover as palavras-passe antes de listar
    list = [{k: v for k, v in u.items() if k != "password"} for u in users]
    return jsonify(list), 200

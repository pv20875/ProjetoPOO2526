import os
import json

FOLDER = os.path.join(os.path.dirname(__file__), "Data")
# utilizadores
FILE1 = os.path.join(FOLDER, "Utilizadores.json")


# carregar dados do ficheiro
def load_users():
    if not os.path.exists(FILE1):
        return []
    with open(FILE1, "r", encoding="utf-8") as f:
        return json.load(f)


# salvar dados para o ficheiro
def save_users(users):
    os.makedirs(FOLDER, exist_ok=True)
    with open(FILE1, "w", encoding="utf-8") as f:
        json.dump(users, f, indent=2)


users = load_users()
save_users(users)

# transações
FILE2 = os.path.join(FOLDER, "Transacoes.json")


def load_tr():
    if not os.path.exists(FILE2):
        return []
    with open(FILE2, "r", encoding="utf-8") as f:
        return json.load(f)


def save_tr(tr):
    os.makedirs(FOLDER, exist_ok=True)
    with open(FILE2, "w", encoding="utf-8") as f:
        json.dump(tr, f, indent=2)


tr = load_tr()
save_tr(tr)

# categorias
FILE3 = os.path.join(FOLDER, "Categorias.json")


def load_ct():
    if not os.path.exists(FILE3):
        return []
    with open(FILE3, "r", encoding="utf-8") as f:
        return json.load(f)


def save_ct(ct):
    os.makedirs(FOLDER, exist_ok=True)
    with open(FILE3, "w", encoding="utf-8") as f:
        json.dump(ct, f, indent=2)


ct = load_ct()
save_ct(ct)

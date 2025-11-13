from flask import Flask
from flask_cors import CORS
from extensions import bcrypt, jwt
from routes.auth import auth
from routes.transacoes import tr_bp
from routes.categorias import ct_bp

# from routes.relatorios import rl_bp

# criar a aplicação
app = Flask(__name__)
# criação do CORS para permitir os cookies cross-origin
CORS(app, supports_credentials=True, origins=["http://127.0.0.1:3000"])

# configuração do JWT
app.config.update(
    {
        "JWT_SECRET_KEY": "supersecretkey",
        "JWT_TOKEN_LOCATION": ["cookies"],
        "JWT_ACCESS_COOKIE_PATH": "/",
        "JWT_COOKIE_SECURE": False,
        "JWT_COOKIE_SAMESITE": "Lax",
        "JWT_ACCESS_TOKEN_EXPIRES": 86400,  # expiração do token (1 dia convertido em segundos)
        "JWT_COOKIE_CSRF_PROTECT": False,
    }
)

bcrypt.init_app(app)  # inicializar bcrypt
jwt.init_app(app)  # inicializar JWT

# registar blueprints (rotas)
app.register_blueprint(auth)
app.register_blueprint(tr_bp)
app.register_blueprint(ct_bp)

# iniciar o servidor
if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)
